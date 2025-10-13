# DAW2-Proyecto-intermodular

> Por el momento, en este repositorio sólo se ha trabajado para la práctica 1.1 del módulo Despliegue de Aplicaciones Web.
---

<br>

## A. Documentación del proceso

### Herramientas usadas para generar documentación y comandos ejecutados: 

- ``Java 21``, ``Spring Boot`` y ``Maven``: Lenguaje y herramientas con las que estamos trabajando en otro módulo, con las cuales se realizará el proyecto.
- ``Javadoc``: Empleado tanto en el formato de documentación en el código como en la generación de su correspondiente HTML (junto a una hoja de estilos y JavaScript necesario para desplegar una página web con la información). Comando empleado para la generación del HTML:

  ```
  mvn clean javadoc:javadoc
  ```

- ``wkhtmltopdf``: Empleado para la conversión del HTML generado al formato PDF. Comandos empleados:
  
  ```bash
  sudo apt-get update && sudo apt-get install -y wkhtmltopdf #instalación
  ```
  ```bash
  for html in $(find target/reports/apidocs -type f -name "*.html"); do
  #Itera uno por uno sobre cada archivo HTML encontrado dentro de ``target/reports/apidocs``.
  
  relative_path=$(realpath --relative-to=target/reports/apidocs "$html")
  #Obtiene la ruta relativa del HTML respecto a ``target/reports/apidocs``.
  
  pdf_path="target/reports/pdf/${relative_path%.html}.pdf"
  #Quita la extensión ``.html`` del archivo y define la ruta del PDF de salida.
  
  mkdir -p "$(dirname "$pdf_path")"
  #Obtiene la carpeta de origen y crea dicha carpeta, además de todas las intermedias, si no existen, evitando errores.
  
  echo "Generando $pdf_path..."
  #Mensaje en la consola que informa sobre la creación de los PDFs.
  
  wkhtmltopdf --enable-local-file-access "file://$(pwd)/$html" "$pdf_path"
  #Permite que ``wkhtmltopdf`` lea archivos locales referenciados en el HTML para generar el PDF.
  
  done #Fin del bucle.
  ```
  
- ``GitHub Actions``: Empleado para la automatización de la documentación del proyecto, integrándose en el repositorio de trabajo (es decir, nos permite tener un historial de los artefactos así como mantener una publicación automática en ``GitHub Pages``).
---

### Ejemplos de código documentado y fragmento con las etiquetas/estructura usadas:
Clase principal documentada: [AplicacionSaludo.java](https://github.com/Lmrocio/DAW2-Proyecto-intermodular/blob/c62a2b2825a9846c8838bfb74056fd29630f220f/backend/src/main/java/com/example/backend/AplicacionSaludo.java#L23-L34)
  ```java
    /**
     * Método principal que construye un saludo simple.
     *
     * @param nombre nombre de la persona; si es nulo o vacío se usa "Edu"
     * @return saludo en texto plano
     */
    public String saludar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            nombre = "Edu";
        }
        return "¡Hola, " + nombre + "!";
    }
  ```
La documentación está escrita siguiendo el estilo y la sintaxis de ``JavaDoc``, el estándar en Java, que permite documentar clases y métodos con bloques ``/** ... */`` y etiquetas como ``@param``, la cual describe los parámetros de entrada del método, y ``@return``, para describir las salidas del método.

---

### Formatos generados (HTML + PDF) y enlaces a cada uno:

- [Formato HTML](docs)
- [Formato PDF](docs/pdf)

---

### Explicación breve del workflow:
Este workflow se encarga de automatizar la generación, conversión y despliegue de la documentación del proyecto cada vez que se hace un ``push`` a ``main`` o se ejecuta manualmente ``workflow_dispatch``. El resumen del flujo sería:

1. **Ejecución en Ubuntu**(runs-on: ubuntu-latest): ``GitHub Actions`` crea un entorno virtual basado en ``Ubuntu`` donde se ejecutan todos los pasos. En este proceso, ``Ubuntu`` proporciona: un sistema Linux completo con acceso a paquetes (apt-get), compatibilidad para instalar herramientas como ``wkhtmltopdf`` y utilidades de línea de comandos (find, mkdir, etc.). Gracias a esto, el workflow es reproducible y no depende del sistema local de ningún desarrollador
2. **Clonar el repositorio**: en este paso se obtiene el código más reciente para trabajar sobre él.
3. **Configurar entorno ``Java`` y ``Maven``**: Java versión 21 con distribución Temurin (Java no tiene una única versión oficial gratuita, por lo que existen varias distribuciones que proporcionan la misma versión de Java empaquetada) y Maven versión 3.9.11 se instalan en ``Ubuntu`` para compilar y generar Javadoc.
4. **Generar documentación HTML**: Ejecuta el comando ``mvn clean javadoc:javadoc`` para crear la documentación en formato HTML en el directorio ``target/reports/apidocs``.
5. **Instalar wkhtmltopdf**: Herramienta que convierte HTML a PDF.
6. **Convertir HTML a PDF**: Itera sobre todos los archivos HTML generados y genera PDFs correspondientes en el directorio ``target/reports/pdf`` manteniendo la estructura de las carpetas.
7. **Subir PDFs como artefactos**: Permite descargar los PDFs generados desde la interfaz de ``GitHub Actions``.
8. **Actualizar la carpeta ``/docs``**: Copia HTML y PDFs a ``/docs`` para tenerlos organizados dentro del repositorio.
9. **Commit y push de los cambios en ``/docs``**: Guarda automáticamente la actualización de la documentación en la rama ``main``, empleando el bot de ``GitHub Actions``.
10. **Despliegue en ``GitHub Pages``**: Publica la documentación HTML en la rama ``gh-pages``, haciendo que sea accesible públicamente como página web.

---

### Mensajes de commit:
Adjunto una captura con algunos de los últimos commit realizados donde trato de indicar de forma clara y descriptiva los cambios realizados en el proyecto. No todos los commits están escritos en imperativo, pero todos detallan claramente las modificaciones realizadas para no dejar margen de equivocación.

<img width="1649" height="670" alt="Captura de pantalla 2025-10-13 214637" src="https://github.com/user-attachments/assets/145d8b84-c52d-4434-9058-ab7dc541fe4f" />

---

### Evidencia de configuración SSH para GitHub:
Adjunto una captura de pantalla como evidencia:

<img width="722" height="94" alt="Captura de pantalla 2025-10-13 215448" src="https://github.com/user-attachments/assets/36338419-c4f2-4235-9e65-ec589e08ebb1" />

---

###  Cómo clonar/usar el repositorio para reproducir la generación de documentación:
Para reproducir la documentación del proyecto, puedes hacerlo **de forma local** o **automáticamente mediante GitHub Actions**.

***Opción 1: Localmente***
1. Clona el repositorio y entra en la carpeta del backend:
   ```bash
   git clone https://github.com/Lmrocio/DAW2-Proyecto-intermodular.git
   cd DAW2-Proyecto-intermodular/backend
  ```
2. Ejecuta el siguiente comando de Maven para generar la documentación HTML en ``target/reports/apidocs/``:
  ```bash
  mvn clean javadoc:javadoc
  ```
***Opción 2: A través de GitHub Actions***
Cada vez que se haga push a la rama main o se ejecute manualmente el workflow (workflow_dispatch), se iniciará automáticamente el job generate-docs, que:
- Genera la documentación HTML con Maven.
- Convierte todos los archivos HTML en PDF usando wkhtmltopdf.
- Copia los resultados a las carpetas correspondientes.
- Sube los PDF como artefactos del workflow y actualiza la documentación publicada en GitHub Pages.

Con esta segunda opción evitamos instalar ``wkhtmltopdf`` localmente, por lo que cualquier usuario puede generar y descargar los PDF directamente desde la sección ``Actions`` del repositorio.

---

<br>

## B Respuestas al cuestionario

### a. Identificación de herramientas de generación de documentación. ¿Qué herramienta o generador (p. ej., Sphinx, pdoc, Javadoc, Doxygen, Dokka) utilizaste en el workflow para crear la documentación en /docs?
En este proyecto se ha utilizado ``Javadoc`` como herramienta principal de generación de documentación.
Javadoc es el generador oficial de documentación para proyectos Java, incluido dentro del JDK, y permite transformar los comentarios estructurados del código fuente (con etiquetas como ``@param``, ``@return``, etc.) en una página web navegable en formato HTML.

El workflow de GitHub Actions ejecuta el siguiente comando para generar dicha documentación en la carpeta /docs: 
````bash
mvn clean javadoc:javadoc
````

Posteriormente, se emplea la herramienta wkhtmltopdf para convertir esos archivos HTML en su versión PDF, manteniendo el formato y estructura de la documentación web. De este modo, y como resumen, podemos ver que:
- ``Javadoc`` se encarga de generar la documentación HTML desde el código Java.
- ``wkhtmltopdf`` convierte automáticamente ese HTML en PDF, como segundo formato complementario.
- Ambos procesos están automatizados mediante ``GitHub Actions``, que actualiza los resultados en la carpeta ``/docs`` y publica la documentación en ``GitHub Pages``.

---
 
### b. Documentación de componentes. Muestra un fragmento del código con comentarios/docstrings estructurados (p. ej., :param, :return: o etiquetas equivalentes) que haya sido procesado por la herramienta. Comenta que estilo de documentación has utlicado: (p. ej., reStructuredText, Google Style, KDoc)

A continuación, muestro un fragmento del código fuente documentado con el formato JavaDoc, que ha sido procesado por la herramienta Javadoc para generar la documentación en formato HTML y PDF [enlace al código fuente](https://github.com/Lmrocio/DAW2-Proyecto-intermodular/blob/c62a2b2825a9846c8838bfb74056fd29630f220f/backend/src/main/java/com/example/backend/AplicacionSaludo.java#L23-L34)

````bash
  /**
     * Método principal que construye un saludo simple.
     *
     * @param nombre nombre de la persona; si es nulo o vacío se usa "Edu"
     * @return saludo en texto plano
     */
    public String saludar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            nombre = "Edu";
        }
        return "¡Hola, " + nombre + "!";
    }
````
La documentación está escrita siguiendo el estilo ``JavaDoc``, el estándar utilizado en proyectos Java.
Este formato emplea comentarios estructurados entre /** ... */ y etiquetas como:
- ``@param``: describe los parámetros de entrada del método.
- ``@return``: explica el valor devuelto.

Este estilo permite que la herramienta ``Javadoc`` procese automáticamente la información y genere documentación navegable en formato HTML (y posteriormente PDF mediante ``wkhtmltopdf``), manteniendo una estructura clara.

---
 
### c. Multiformato. ¿Qué segundo formato (además de HTML) generaste? Explica la configuración o comandos del workflow y herramientas que lo producen.
Además del HTML producido por Javadoc, se generó PDF como segundo formato. El PDF se obtiene convirtiendo los HTML generados por Javadoc usando wkhtmltopdf, manteniendo la estructura de carpetas y estilos de la documentación web. He elegido este segundo formato porque es portátil y fácil de descargar/archivar, además de que es el formato más adecuado para imprimir o entregar como documento único. Herramientas usadas son:

- ``Javadoc``: genera la documentación HTML (``mvn clean javadoc:javadoc``).
- ``wkhtmltopdf``: convierte páginas HTML locales a documentos PDF.
- ``Ubuntu (runner)``: entorno en ubuntu-latest donde se instala ``wkhtmltopdf`` mediante ``apt-get``.
- ``GitHub Actions``: coordina todo el proceso (generación, conversión, subida y despliegue). El workflow de ``GitHub Actions`` recorre los HTML y genera PDFs en ``target/reports/pdf/`` y ``docs/pdf/``.
- ``actions/upload-artifact``: sube los PDF como artefactos del workflow. De esta forma, los PDFs quedan disponibles de dos maneras: artefactos descargables desde el workflow y copiados dentro de ``docs/pdf/`` en el repositorio.
- ``Script shell'': para los comandos ``find``, ``realpath``, ``mkdir``, ``wkhtmltopdf``, etc., que permiten iterar y convertir archivos.

---
 
### d. Colaboración. Explica cómo GitHub facilita mantener la documentación (actualizaciones del README.md y de /docs) cuando colaboran varias personas (PRs, reviews, checks de CI, protección de ramas).

GitHub permite que varios colaboradores mantengan el ``README.md`` y la carpeta ``/docs`` de forma organizada y controlada. Cada cambio se puede realizar en una rama aparte y enviarse mediante ``pull request``(PR), permitiendo revisiones de otros miembros antes de fusionar con la rama ``main``.

Los workflows de ^^GitHub Actions`` se ejecutan automáticamente en cada PR o ``push``, generando la documentación HTML y PDF para comprobar que se crea correctamente antes de integrarla. Esto asegura que la documentación de ``/docs`` y los PDFs se mantengan consistentes y funcionales.

Además, la protección de la rama ``main`` obliga a aprobar PRs y pasar los checks de ``CI`` (Continuous Integration) antes de fusionar, evitando que cambios que rompan la generación de documentación lleguen al repositorio principal. Cada actualización queda registrada en el historial de ``commits``, proporcionando trazabilidad y responsabilidad compartida.

Por último, el workflow despliega automáticamente la documentación HTML en ``GitHub Pages``, de modo que cualquier cambio aprobado se refleja inmediatamente, facilitando que todos los colaboradores y usuarios accedan siempre a la versión más reciente.

---
 
### e. Control de versiones. Muestra mensajes de commit que evidencien el nuevo workflow. ¿Son claros y descriptivos? Justifícalo. Ademas de un conjunto de mensajes de tus commits.
Adjunto una captura, como evidencia, con algunos de los últimos commits realizados, donde trato de indicar de forma clara y descriptiva los cambios realizados en el proyecto:

<img width="1649" height="670" alt="Captura de pantalla 2025-10-13 214637" src="https://github.com/user-attachments/assets/145d8b84-c52d-4434-9058-ab7dc541fe4f" />

En el desarrollo del proyecto he procurado mantener mensajes de commit claros y descriptivos, ya que son esenciales para entender la evolución del repositorio y facilitar el trabajo en equipo. Aunque no todos mis commits están escritos en imperativo, he priorizado que sean precisos y comprensibles, siguiendo una estructura que facilita la lectura tanto por parte de otros colaboradores como por mí misma en futuras revisiones. Esto resulta especialmente útil en proyectos con automatizaciones, como en este caso, donde el workflow genera y actualiza documentación de forma continua; de hecho, podemos ver que he incluido un paso específico para ello: 

````bash
git commit -m "Actualización documentación [skip ci]"
````
Este paso permite que ``GitHub Actions`` suba los cambios generados en ``/docs`` tras crear la documentación en HTML y PDF. La etiqueta ``[skip ci]`` se usa para indicar a ``GitHub Actions`` que no vuelva a ejecutar los workflows automáticamente por ese commit, evitando así un bucle infinito de ejecuciones cada vez que se actualiza la documentación.

---
 
### f. Accesibilidad y seguridad. ¿Qué medidas/configuración del repositorio garantizan que solo personal autorizado accede al código y la documentación? (p. ej., repositorio privado, equipos, roles, claves/secretos, branch protection).

---
 
### g. Instalación/uso documentados. Indica dónde en el README.md explicas el funcionamiento del workflow y dónde detallas las herramientas y comandos de documentación.

---
 
### h. Integración continua. Justifica por qué el workflow utilizado es CI. ¿Qué evento dispara automáticamente la generación/actualización de la documentación (p. ej., push, pull_request, workflow_dispatch)?

---
 
