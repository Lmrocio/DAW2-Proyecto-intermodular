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

<br>

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

<br>

### Formatos generados (HTML + PDF) y enlaces a cada uno:

- [Formato HTML](docs)
- [Formato PDF](docs/pdf)
---

### Explicación breve del workflow:

---

### Mensajes de commit:

---

### Evidencia de configuración SSH para GitHub:

---

###  Cómo clonar/usar el repositorio para reproducir la generación de documentación:
