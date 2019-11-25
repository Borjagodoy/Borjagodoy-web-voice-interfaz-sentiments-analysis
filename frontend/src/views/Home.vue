<template>
  <div class="home">
    <h1>{{process.env}}</h1>
    <h1>What is the name of your assistant?</h1>
    <p>(Remember that I need a name that understand easly)</p>
    <input
      v-if="!hideName && editing"
      type="text"
      @keydown.enter="() => hideName = true"
      v-model="invocationName">
    <div v-else class="name">
      <h1>{{invocationName}}</h1>
      <button @click="() => hideName = false">Change name</button>
    </div>
    <h1>Do you want add wake up words?</h1>
    <p>(for example hey {{invocationName}})</p>
    <input
      v-if="editing"
      type="text"
      @keydown.enter="() => {wakeUpsWords.push(cleanString(word.trim())); word = ''}"
      v-model="word">
      <ul>
        <li 
          v-for="wakeUpWord in wakeUpsWords"
          :key="wakeUpWord"
          @click="wakeUpsWords = removeArray(wakeUpWord)"
          >{{wakeUpWord}}</li>
      </ul>
      <button 
        v-if="editing"
        @click="() => {editing = false; this.hotWordDetection()}">Finish to Edit my agent</button>
      <button v-else @click="() => editing = true">Edit my agent</button>
      <voice-animation
        :active="active"
        :talking="talking"
      ></voice-animation>
    <pre>
      {{response}}
    </pre>
  </div>
</template>

<script>
import VoiceAnimation from '../components/VoiceAnimation.vue'

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
export default {
  name: 'home',
  components:{
    'voice-animation': VoiceAnimation
  },
  data() {
    return {
      hideName: false,
      textToAnalyze: '',
      response: '',
      active: false,
      invocationName: '',
      wakeUpsWords: [],
      word: '',
      process: process,
      editing: true,
      talking: false,
      dialogFlowToken: process.env.VUE_APP_DIALOG_KEY
    };
  },
  methods: {
    removeArray(word){
      return this.wakeUpsWords.filter(item => item != word);
    },
    async fetchToneOfText(text) {
      const response = await fetch(`http://localhost:3000/tone/${text}`);
      return await response.json();
    },
    hotWordDetection(){
      const recognition = new window.SpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = (event) => {
        const speechToText = event.results[event.results.length - 1][0].transcript;
        if(this.wakeUpsWords.includes(this.cleanString(speechToText.trim()))){
          recognition.abort();
          this.active = true;
          this.startNLU();
        }
      }
      recognition.start();
    },
    startNLU(){
      const recognition = new window.SpeechRecognition();
      recognition.lang = 'en'
      recognition.onresult = (event) => {
        const speechToText = event.results[event.results.length - 1][0].transcript;
        recognition.abort();
        // console.log('hot word detected', speechToText)
        this.sendToNLU(speechToText);
        }
      recognition.start();
    },
    async sendToNLU(speechToText){
      let sentyment = await this.fetchToneOfText(speechToText);
      const tone = sentyment.document_tone.tones.length > 0 ? sentyment.document_tone.tones[0].tone_id : '';
      const context = tone ? [tone] : []
      const response = await fetch(`https://api.dialogflow.com/v1/query?v=20150910`, {
        method: 'POST',
        body: JSON.stringify({
        "context": context,
        "lang": "en",
        "query": speechToText,
        "sessionId": "12345"
      }),
        headers: {
        authorization:`Bearer ${this.dialogFlowToken}`,
        'Content-Type': 'application/json'
        }
      });
      const intentDetected = await response.json();
      console.log(intentDetected)
      this.speechResponse(intentDetected.result.fulfillment.speech)
    },
    async speechResponse(text){
      this.textToAnalyze = text;
      const textToSpeech = new SpeechSynthesisUtterance(text);
      textToSpeech.lang = 'en-US';
      this.addListenersToUtterance(textToSpeech);
      speechSynthesis.speak(textToSpeech);
    },
    addListenersToUtterance(utterance){
      utterance.onstart = (event) => {
        this.talking = true;
      };

      utterance.onend = (event) => {
        this.talking = false;
      };
    },
    cleanString(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}
  },
};
</script>
<style scoped>
  .home{
    height: 100vh;
  }
</style>
