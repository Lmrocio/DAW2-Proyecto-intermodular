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
Adjunto un captura con algunos de los últimos commit realizados donde trato de indicar de forma clara y descriptiva los cambios realizados en el proyecto. No todos los commits están escritos en imperativo, pero todos detallan claramente las modificaciones realizadas para no dejar margen de equivocación.

<img width="1649" height="670" alt="Captura de pantalla 2025-10-13 214637" src="https://github.com/user-attachments/assets/145d8b84-c52d-4434-9058-ab7dc541fe4f" />

---

### Evidencia de configuración SSH para GitHub:

---

###  Cómo clonar/usar el repositorio para reproducir la generación de documentación:
