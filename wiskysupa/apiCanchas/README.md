# API de reserva de canchas

API de Express conectada a Supabase.

## Iniciar

```bash
npm install
npm run dev
```

El servidor usa el puerto `3001` para convivir con la API de `apiTienda`, que usa el `3000`. Se puede cambiar con la variable de entorno `PORT`.

Antes de iniciar, ejecuta [`schema.sql`](./schema.sql) en el SQL Editor de Supabase para crear las tablas, políticas y funciones. El archivo `.env` debe contener `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`.

## Rutas

| Método | Ruta | Uso |
|---|---|---|
| GET | `/` | Verificar que la API esté activa |
| GET | `/canchas` | Listar canchas; acepta `buscar` y `deporte` como filtros |
| GET | `/canchas/:id` | Consultar el detalle de una cancha |
| GET | `/canchas/:id/disponibilidad?fecha=AAAA-MM-DD&duracionHoras=1` | Consultar horas disponibles entre 08:00 y 22:00 |
| POST | `/canchas` | Registrar una cancha |
| POST | `/reservas` | Registrar una reserva y calcular el total |

Las reservas no pueden exceder la capacidad, usar fechas pasadas ni cruzarse con otra reserva de la misma cancha. Las duraciones permitidas son de 1 a 4 horas. Supabase calcula disponibilidad sin exponer los nombres ni correos de otras reservas.
