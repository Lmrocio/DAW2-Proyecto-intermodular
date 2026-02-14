import { Component } from '@angular/core';
import { VideoTutorialComponent } from './video-tutorial.component';

/**
 * Componente de ejemplo para demostrar el uso de VideoTutorialComponent
 */
@Component({
  selector: 'app-video-tutorial-demo',
  standalone: true,
  imports: [VideoTutorialComponent],
  template: `
    <div class="demo-container">
      <header class="demo-header">
        <h1>Ejemplo de uso: VideoTutorialComponent</h1>
        <p>Componente de video accesible con subtítulos y transcripción</p>
      </header>

      <section class="demo-section">
        <h2>Uso básico (valores por defecto)</h2>
        <app-video-tutorial></app-video-tutorial>
      </section>

      <section class="demo-section">
        <h2>Uso personalizado</h2>
        <app-video-tutorial
          videoSrc="Qué_es_Bizum_y_cómo_funciona.webm"
          subtitlesEs="tutorial-bizum.vtt"
          subtitlesEn="tutorial-bizum-en.vtt"
          videoTitle="Tutorial completo sobre Bizum"
          [transcription]="customTranscription"
        ></app-video-tutorial>
      </section>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .demo-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .demo-header h1 {
      font-size: 2.5rem;
      color: #0454b1;
      margin-bottom: 0.5rem;
    }

    .demo-header p {
      font-size: 1.25rem;
      color: #737373;
    }

    .demo-section {
      margin-bottom: 4rem;
    }

    .demo-section h2 {
      font-size: 1.875rem;
      color: #f3742b;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #f8d770;
    }
  `]
})
export class VideoTutorialDemoComponent {
  // Transcripción personalizada (puedes cambiarla según necesites)
  customTranscription = `Hola, hoy vamos a hablar de una herramienta que simplifica algo que hacemos todos los días, los pagos. En un mundo cada vez más digital vamos a ver como una solución que probablemente ya está en muchos móviles está cambiando las pequeñas transacciones del día a día. Seguro que esta situación nos suena a todos, ¿verdad? Tener que buscar ese número de cuenta larguísimo de un amigo o rebuscar en los bolsillos para encontrar el cambio exacto para un café. Vamos, una molestia cotidiana que conocemos de sobra. Pues la solución, la verdad, es mucho más sencilla de lo que parece. Se trata de pasar de la complejidad de los números IBAN a la simplicidad de algo que usamos a todas horas, un número de teléfono. Vale, pues vamos al lío. La herramienta que consigue esto es Bizum. Y lo más interesante es que con toda probabilidad ya está integrada en el móvil de la mayoría, a veces sin que ni siquiera nos demos cuenta. Entonces, ¿qué es exactamente? Pues es muy fácil. Bizum es un servicio gratuito que está dentro de la aplicación de nuestro banco. Su función principal es permitirnos enviar y recibir dinero al momento entre particulares usando solo el número de teléfono, nada más. Y sus ventajas son muy claras. Primero, es gratis. Segundo, y esto es clave, ya está integrado en la app del banco. ¿Qué significa esto? Pues que no hay que descargar nada nuevo, ni crear cuentas adicionales, ni aprender a usar una aplicación desde cero. Ya está ahí. Pasemos ahora a una de sus mayores virtudes, la velocidad. Y no hablamos de pagos rápidos, no hablamos de pagos que son prácticamente instantáneos. Fijaos en este dato. Menos de 5 segundos. Ese es el tiempo que tarda el dinero en viajar de una cuenta bancaria a otra. Vamos, que es casi más rápido que sacar la cartera del bolsillo. Claro, esto lo hace perfecto para las situaciones del día a día. Se acabó el no llevar dinero suelto para un café o el complicarse para recoger dinero para un regalo en grupo. Ahora todo se resuelve con un par de toques en la pantalla. Muy bien, ya hemos visto qué es y por qué es tan útil. Ahora la pregunta del millón, ¿cómo se usa? Vamos a verlo paso a paso, que es muy muy sencillo. Antes de empezar, solo hay un requisito, tener un teléfono móvil con la aplicación de nuestro banco instalada. Y ya está, nada más. El proceso es superdo. Primero, se abre la aplicación del banco, la de siempre. Segundo, se busca la sección de Bizum de envío de dinero. Tercero, se elige un contacto directamente de la agenda. Y cuarto, se introduce el importe y se confirma la operación, normalmente con la misma clave que se usa para otras transacciones. Así de simple. Y llegamos a un punto fundamental, uno que es seguro que genera preguntas. Cuando hablamos de dinero, la seguridad es lo primero. Así que, ¿es seguro usar este servicio? La pregunta es directa, ¿verdad? ¿Nos podemos fiar de este sistema? Pues la respuesta es un sí rotundo. Y la clave es esta. Bizum cuenta con la garantía y la seguridad del propio banco. Ojo, no es una aplicación externa, es un servicio que opera con los mismos sistemas de seguridad que cualquier otra transferencia bancaria que ya hagamos. Al final, de lo que se trata es de poder gestionar los pagos de cada día de una forma cómoda, rápida y, sobre todo segura. Es una herramienta diseñada para los tiempos que corren y para hacernos la vida financiera un poco más fácil. Y para terminar, dejamos una reflexión en el aire. Con todo esto en mente, ¿qué tal probarlo en alguna ocasión? Puede que descubramos una forma mucho más sencilla de gestionar el dinero del día a día.`;
}
