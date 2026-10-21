# Base de datos y Git en LUDO-MANIA

Este documento explica cómo quedó organizada la base de datos para que el
archivo `.db` siga en el repositorio, no se borre de ninguna PC y se pueda
hacer `commit` y `push` sin conflictos por ser un archivo binario.

## El problema

SQLite guarda todo en un solo archivo binario (`ludo_mania.db`). Git no puede
fusionar dos versiones de ese archivo: si dos personas lo modifican, aparece un
conflicto que no se puede resolver automáticamente. Como el juego guarda
jugadores y partidas cada vez que se prueba, el archivo cambiaba en todas las
PCs y trababa los `pull` / `push`.

## La solución: plantilla versionada + base local

Ahora hay dos archivos con roles distintos:

| Archivo | ¿Está en Git? | ¿Quién lo modifica? | Para qué sirve |
|---|---|---|---|
| `database/ludo_mania.db` | Sí | Solo el dueño del proyecto, a propósito | Plantilla: esquema y datos base |
| `database/ludo_mania_local.db` | No (ignorado) | El juego, en cada PC | Jugadores y partidas de esa PC |
| `database/version_esquema.txt` | Sí | Solo el dueño del proyecto | Indica la versión de la plantilla |

Al iniciar el servidor, `backend/database.py` se encarga de todo:

1. Si no existe `ludo_mania_local.db`, la crea copiando la plantilla.
2. Si existe pero es de una versión anterior, guarda una copia de seguridad
   (`ludo_mania_local.db.bak`) y la recrea desde la plantilla nueva.
3. Si ya está en la versión actual, no la toca.

El juego **nunca escribe** en `ludo_mania.db`. Por eso la plantilla deja de
cambiar mientras se juega y Git deja de verla modificada. Los datos de cada
partida van a `ludo_mania_local.db`, que Git ignora.

## Qué significa para el equipo

- Cada PC tiene su propio ranking y sus propios jugadores de prueba.
  **Los rankings ya no se comparten por Git.** Si en algún momento se necesita
  un ranking compartido entre todos, hay que usar una base de datos en un
  servidor (por ejemplo PostgreSQL o Supabase), no un archivo SQLite.
- Los cambios de esquema o de datos base que haga el dueño sí llegan a todos
  con `git pull`.
- Nadie tiene que borrar archivos a mano ni resolver conflictos del `.db`.

## Migración: qué hacer una sola vez

### Si sos el dueño del proyecto (la única persona que diseña la base)

Después de aplicar estos cambios y antes de commitear:

1. Cerrá el juego.
2. Decidí qué contenido querés que quede como plantilla en
   `database/ludo_mania.db`:
   - Si el archivo actual ya tiene el esquema y los datos base que querés
     publicar, dejalo como está y commitealo.
   - Si tiene partidas de prueba que no querés publicar, restaurá la plantilla
     con `git checkout -- database/ludo_mania.db`.
3. Commiteá y pusheá los cambios de código, `.gitignore`,
   `version_esquema.txt` y la plantilla si corresponde.

### Si sos tester (solo jugás y probás)

No hace falta conservar rankings ni partidas de prueba. Lo único necesario es
que Git no se trabe:

1. Cerrá el juego.
2. `git pull`
3. Abrí el juego normalmente. Va a usar `ludo_mania_local.db`.

Si el `pull` se queja por `database/ludo_mania.db` (porque quedó modificado de
alguna prueba anterior), descartá ese cambio y repetí:

```bash
git checkout -- database/ludo_mania.db
git pull
```

Eso borra solo las partidas de prueba de esa PC, que no importan. Después de
esta limpieza única, el archivo ya no se vuelve a modificar al jugar y los
`pull` futuros salen limpios.

## Cómo publicar un cambio de esquema o de datos base (solo el dueño)

1. Cerrá el juego.
2. Modificá `database/ludo_mania.db` (con DB Browser for SQLite, la extensión
   de VS Code, o copiando tu `ludo_mania_local.db` si ese es el contenido que
   querés publicar).
3. Subí el número en `database/version_esquema.txt` (por ejemplo de `1` a `2`).
4. Commiteá y pusheá **juntos** la plantilla y el archivo de versión.

Cuando los demás hagan `git pull` y abran el juego, la versión nueva se detecta
automáticamente: su base local se respalda como `.bak` y se recrea desde la
plantilla. Pierden las partidas de prueba de esa PC, pero no hay conflictos ni
pasos manuales.

> Importante: si cambiás el esquema pero no subís el número de versión, las
> bases locales viejas no se actualizan y el juego puede fallar.

## Comandos útiles

```bash
# Ver si hay archivos sin trackear o modificados
git status

# Confirmar que la base local está ignorada (no debe aparecer)
git check-ignore -v database/ludo_mania_local.db

# Ver qué archivos de base de datos están versionados
git ls-files database/

# Descartar cambios locales de la plantilla (con el juego cerrado)
git checkout -- database/ludo_mania.db
```

## Preguntas frecuentes

**¿Se borra la base de datos del repositorio?**
No. `database/ludo_mania.db` sigue versionada y se mantiene como plantilla.

**¿Se borra la base de datos de mi PC al hacer pull?**
No. Tus partidas viven en `ludo_mania_local.db`, que Git no toca. Solo se
recrea si el dueño publica una versión nueva de esquema, y aun así queda un
respaldo `.bak`.

**¿Por qué no usar Git LFS?**
LFS evita que el archivo pese en el historial, pero no resuelve los conflictos
de contenido: sigue siendo un binario que no se puede fusionar. Acá el archivo
pesa pocos KB, así que tampoco hace falta.

**¿Por qué no usar `merge=ours`?**
Porque resuelve el conflicto descartando silenciosamente los cambios del otro
lado. En este proyecto los testers nunca recibirían los cambios de esquema y
el juego les fallaría.

**¿Y si dos personas necesitan ver el mismo ranking?**
Eso requiere una base de datos centralizada (servidor). SQLite local no está
pensado para escritura concurrente entre máquinas.
