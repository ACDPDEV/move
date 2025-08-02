# MOVE 

**MOVE** es una plataforma educativa interactiva diseñada para facilitar el aprendizaje de física y matemáticas mediante simulaciones visuales accesibles desde la web. Está construida con [Astro], lo que garantiza un rendimiento óptimo y una arquitectura moderna orientada a componentes.


## Descripción

Este repositorio contiene el código fuente de *MOVE*, una iniciativa orientada a estudiantes de nivel secundario y universitario que busca ofrecer herramientas intuitivas para el estudio de conceptos científicos a través de experiencias digitales interactivas.

El proyecto está pensado para ser:

- Claro y navegable
- Rápido y eficiente
- Modular y mantenible
- Accesible desde cualquier dispositivo

---

## Estructura

```text
/
├── public/                # Recursos estáticos (favicon, imágenes, etc.)
├── src/
│   ├── components/        # Componentes reutilizables de interfaz.
│   ├── layouts/           # Estructuras generales de página.
│   ├── pages/             # Rutas visibles del sitio.
│   ├── styles/            # Estilos globales o utilitarios.
│   └── env.d.ts           # Tipos para desarrollo con Astro.
├── astro.config.mjs       # Configuración principal del framework.
├── tsconfig.json          # Configuración de TypeScript.
└── package.json           # Dependencias y scripts del proyecto.
```

---

## Tecnologías utilizadas

- [Astro](https://astro.build)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/)

---

## Scripts disponibles

| Comando         | Descripción                                                   |
|-----------------|---------------------------------------------------------------|
| `pnpm install`  | Instala todas las dependencias.                               |
| `pnpm dev`      | Inicia un servidor local de desarrollo.                       |
| `pnpm build`    | Genera la versión optimizada para producción.                 |
| `pnpm preview`  | Muestra una vista previa del sitio generado.                  |
| `pnpm test`     | Ejecuta las pruebas automáticas para verificar el código.     |
| `pnpm coverage` | Muestra el porcentaje de cobertura de las pruebas.            |

> **Nota:** el entorno de desarrollo no es necesario para usuarios finales. El sitio ya está disponible en línea.
---

## Licencia

Distribuido bajo la licencia [GPL v3](LICENSE).  
© 2025 - [ACDPDEV](https://github.com/ACDPDEV) - [TheDormitabis](https://github.com/TheDormitabis)
