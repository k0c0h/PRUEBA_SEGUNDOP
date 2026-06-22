# Fintech SecurePay Base - Evaluación Segundo Parcial

## Información General

**Estudiante:** Kerlly Alexandra Chiriboga Cabrera

**Asignatura:** Aplicaciones Distribuidas

**Repositorio:** https://github.com/k0c0h/PRUEBA_SEGUNDOP.git 

---

# Fase 1: Inyección de Control y Responsabilidad Única

## Objetivo

Aplicar los principios SOLID, específicamente:

* SRP (Single Responsibility Principle)
* DIP (Dependency Inversion Principle)

## Actividades Realizadas

* Separación de la lógica monolítica en servicios especializados.
* Creación de:

  * ValidationService
  * RepositoryService
  * NotificationService
  * AccountService
  * TransactionService
* Inyección de dependencias mediante constructor.
* Merge controlado hacia la rama principal.

### Commit realizado

```bash
refactor(solid): segregar logica del monolito e inyectar dependencias por constructor
```
![Separacion de responsabilidades](evidencias/Captura%20de%20pantalla%202026-06-22%20075753.png)

---

# Fase 2: Seguridad y Autenticación Asimétrica Stateless

## Objetivo

Implementar autenticación basada en JWT firmado asimétricamente mediante RS256.

## Actividades Realizadas

* Generación de claves criptográficas:

  * private.pem
  * public.pem
* Implementación de firma JWT utilizando RS256.
* Construcción de payload seguro con:

  * sub
  * name
  * exp (2 minutos)
* Validación autónoma mediante llave pública.
* Protección de rutas mediante middleware de autenticación.

### Commit realizado

```bash
feat(jwt): implementar firmado asimetrico rs256 y middleware de validacion autonoma public-key
```

## Evidencia: Token JWT generado

![Token JWT validado](evidencias/Captura%20de%20pantalla%202026-06-22%20083827.png)

## Evidencia: Acceso autorizado con token válido

![Token válido](evidencias/Captura%20de%20pantalla%202026-06-22%20084817.png)

## Evidencia: Token expirado

![Token expirado](evidencias/Captura%20de%20pantalla%202026-06-22%20084055.png)

---

# Fase 3: Observabilidad y Error Tracking

## Objetivo

Implementar monitoreo distribuido mediante Sentry diferenciando errores lógicos de errores operacionales.

## Actividades Realizadas

* Integración del SDK de Sentry.
* Configuración del archivo instrument.js.
* Manejo diferenciado de errores:

  * 401/403 → errores lógicos (sin reporte a Sentry)
  * 500 → errores operacionales (reportados a Sentry)
* Inclusión de Tags personalizados con el identificador del usuario autenticado.

### Commit realizado

```bash
feat(sentry): instrumentar backend y separar manejo de excepciones logicas 401 de fallos operacionales 500
```

## Evidencia: Error Operacional 500 registrado en Sentry
![Error 500](evidencias/Captura%20de%20pantalla%202026-06-22%20092720.png)

![Error 500](evidencias/Captura%20de%20pantalla%202026-06-22%20085002.png)
![Error 500](evidencias/Captura%20de%20pantalla%202026-06-22%20085014.png)


## Evidencia: Tags personalizados capturados

![Tags usuario](evidencias/Captura%20de%20pantalla%202026-06-22%20084817.png)
`


---

# Seguridad del Repositorio

## Archivos excluidos mediante .gitignore

Se configuró el repositorio para evitar la exposición de información sensible:

* .env
* private.pem
* public.pem

## Archivo de ejemplo

```txt
.env.example
```

como plantilla de configuración para despliegue.

---

# Conclusiones

* Se aplicó el principio de responsabilidad única para desacoplar la lógica de negocio.
* Se implementó autenticación segura mediante JWT firmado con criptografía asimétrica RS256.
* Se integró observabilidad utilizando Sentry para monitoreo y trazabilidad de errores operacionales.
* Se mantuvieron buenas prácticas de seguridad evitando publicar credenciales y llaves criptográficas en el repositorio.
