<template>
  <q-page class="flex flex-center">
    <div class="chat-container">
      <div ref="chatOutputRef" class="chat-output q-mb-md">
        <div v-for="(message, index) in messages" :key="index" class="chat-message">
          <div :class="`message message-${message.sender}`" v-html="message.text"></div>
          <div v-if="isLoading && index === messages.length - 1" class="loading-indicator"> 
            <span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <q-input
          filled
          v-model="userInput"
          type="textarea"
          placeholder="메시지를 입력하세요"
          @keydown.enter="handleEnterKey"
          :disabled="isLoading"
          class="chat-textarea bg-transparent borderless"
        >
          <template v-slot:append>
            <q-btn
              v-if="!isLoading"
              icon = "send"
              flat
              round
              color = "primary"
              @click = "sendMessage"
              :disabled="!userInput"
            />
            <q-spinner v-else color="primary" size="24px" />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { endPoint } from "../../endpoint";

const userInput = ref('');
const question = ref('');
const messages = reactive([]);
const isLoading = ref(false);
const chatOutputRef = ref(null);

function handleEnterKey(event){
  if(event.shiftKey){
    return;
  }

  event.preventDefault();

  if (!isLoading.value){
    sendMessage();
  }
}

async function sendMessage() {
  if (!userInput.value.trim()) return;

  isLoading.value = true;
  question.value = userInput.value;
  userInput.value = '';

  messages.push({
    sender: 'user',
    text: question.value
  });

  scrollToBottom();

  try {
    const response = await fetch(`${endPoint}/chatgpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: question.value })
    });

    if (!response.ok) {
      throw new Error('서버 에러: 상태 코드 ${response.status}');
    }

    const data = await response.json();

    messages.push({
      sender: 'chatgpt',
      text: data.text
    });
  } catch (error) {
    console.error('ChatGPT와 통신하는 동안 에러가 발생했습니다: ', error);

    messages.push({
      sender: 'system',
      text: '에러가 발생했습니다. 다시 시도해주세요.'
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
}

function scrollToBottom(){
  nextTick(() => {
    if(chatOutputRef.value){
      chatOutputRef.value.scrollTop = chatOutputRef.value.scrollHeight;
    }
  });
}

onMounted(scrollToBottom);
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 90vh; 
  width: 95%;
}

.chat-output {
  flex-grow: 1;
  overflow-y: auto;
  background: #f2f2f2;
  border: 1px solid #ccc;
  padding: 10px;
}

.chat-message .message {
  white-space: pre-wrap; 
  word-break: break-word; 
  margin-bottom: 5px;
  border-radius: 5px;
  padding: 5px 10px;
}

.message-user {
  background-color: #ECCEF5;
  text-align: left;
}

.message-chatgpt {
  background-color: #81F7BE;
  text-align: left;
}

.chat-input .q-textarea textarea{
  width: 100%;
  resize: none;
}

.q-textarea textarea {
  background: transparent !important; 
  border: none !important; 
  box-shadow: none !important; 
}

.q-textarea .q-field__control {
  min-height: 50px; 
}

.spinner {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.loading-indicator {
  text-align: center;
  font-size: 30px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.dot1, .dot2, .dot3 {
  animation: blink 1.4s infinite;
  vertical-align: middle;
}

.dot2 {
  animation-delay: 0.2s;
}

.dot3 {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>
