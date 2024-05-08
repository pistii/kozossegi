<template>
  <v-container fill-height fluid>

    <v-row align="center" justify="center">

      <v-col>
        <div class="py-12" style="position: absolute;">
          <Transition name="slide-fade">
            <div class="textbox" v-if="showBrandTitle">
              <h1>Social Stream</h1>
            </div>
          </Transition>
        </div>
      </v-col>
      <v-card class="signInContainer pa-6">
        <Transition name="slide-fade">
          <SignIn />
        </Transition>

      </v-card>
      <!--https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d-->
      <v-col cols="6" >
        <section id="example-element" :style="aboutInfo">
          <p class="face front" >
            {{ aboutItem }}
          </p>
          <p class="face top" > 
            {{ aboutItem }}
          </p>
          <p class="face back" >
            {{ aboutItem }}
          </p>
          <p class="face bottom" >
            {{ aboutItem }}
          </p>
        </section>
      </v-col>
    </v-row>
    
  </v-container>
  <v-container fill-height fluid>
    <v-row fill-height align="end" justify="center">
      <v-img class="mask1 " src="/src/assets/5495.jpg"></v-img>
    </v-row>
  </v-container>

</template>
<script>
import { ref } from 'vue';
import SignIn from '../views/LoginAndRegister/SignInCompact.vue';

export default {
  computed: {
    aboutInfo() {
      
      return {
        transform: 'rotate3d(1, 0, 0,' + this.deg + 'deg)'
      }
    }
  },
  components: {
    SignIn,
  },
  data() {
    return {
      showBrandTitle: false,
      infos: {'Contact with people': 'front', 
      'make friendships': 'top',
      'some random text': 'back',
      'another random text': 'bottom',
      },
      deg: 0,
      aboutItem: 'Contact with people',
      aboutKey: 'top',
      iterator: 0,
    }
  },
  created() {
    setInterval(() => {
      this.deg += 90;
    }, 4000);
    
  }
}
</script>

<style scoped>
#example-element {
  width: 300px;
  height: 100px;
  transform-style: preserve-3d;
  transition: transform 1.5s;
}

.mask1 {
  max-width: 600px;
  height: 400px;
  background-color: #6DB3F2;
  background-image: url('src/assets/5495.jpg');
  -webkit-mask-image: linear-gradient(black, transparent);
  mask-image: linear-gradient (black, transparent);
}

.face {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: inherit;
  font-size: 30px;
  color: #fff;
}

.front {
  background: rgb(90 90 90 / 99%);
  transform: rotateX(180deg) translateZ(50px);
}

.back {
  background: rgb(0 210 0 / 99%);
  transform: translateZ(50px);
}

.top {
  background: rgb(210 210 0 / 99%);
  transform: rotateX(90deg) translateZ(50px);
}

.bottom {
  background: rgb(210 0 210 / 99%);
  transform: rotateX(-90deg) translateZ(50px);
}

.textbox {
  position: relative;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.slide-fade-enter-active {
  transition: all 0.7s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(.79, .34, .99, .98);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>