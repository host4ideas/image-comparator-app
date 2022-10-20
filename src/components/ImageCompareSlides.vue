<template>
    <swiper
        class="mySwiper swiper-h"
        :spaceBetween="5"
        :pagination="{
            clickable: true,
        }"
        :modules="modules"
    >
        <swiper-slide v-for="(images, index) in getImages" :key="index">
            <Slide :takenImage="takenImage" :slideResults="images" />
        </swiper-slide>
    </swiper>
</template>
<style scoped>
img {
    width: 300px;
    height: 300px;
}

canvas {
    width: 300px;
    height: 300px;
}

.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    background: rgb(126, 125, 125);

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.swiper-v {
    background: rgb(255, 255, 255);
}
</style>
<script>
// Vue
import { defineComponent, watch, watchEffect, toRefs, toRaw, Ref } from "vue";
// Swiper
import { Autoplay, Keyboard, Pagination, Zoom, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper-bundle.css";
import "@ionic/vue/css/ionic-swiper.css";
// Custom components
import Slide from "@/components/Slide.vue";

export default defineComponent({
    props: {
        takenImage: HTMLImageElement,
        slideResults: Object, // slideResults = {[opencvResults], [possibleDuplicatedImages]}
    },
    components: { Swiper, Slide, SwiperSlide },
    computed: {
        getImages() {
            // console.log the prop -> target = Object{canvasResults: canvas, possibleDuplicatedImages: }
            console.log(this.slideResults);

            const slideResults = JSON.parse(JSON.stringify(this.slideResults));

            console.log(slideResults);

            console.log(slideResults.canvasResults);
            console.log(slideResults.possibleDuplicatedImages);

            // To destructure props and don't lose reactivity we need to convert them into ref
            // const { slideResults } = toRaw(this.slideResults);

            // console.log(slideResults);

            // const { canvasResults, possibleDuplicatedImages } = toRaw(
            //     this.slideResults
            // );

            // console.log(canvasResults[0]);
            // console.log(this.takenImage);

            // // In order to pass to a slide the images as: Array<Object> where [{imageFile, canvas}]
            // /**
            //  * @type {Array<{ image: HTMLCanvasElement[], opencvResult: File[] }>}
            //  */
            const images = [];
            // for (let i = 0; i < canvasResults.length; i++) {
            //     images.push({
            //         image: possibleDuplicatedImages[i],
            //         opencvResult: canvasResults[i],
            //     });
            // }
            // console.log(images);
            return images;
        },
    },
});
</script>
