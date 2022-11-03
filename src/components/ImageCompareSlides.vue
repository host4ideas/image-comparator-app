<template>
    <swiper
        class="mySwiper swiper-h"
        :spaceBetween="5"
        :pagination="{
            clickable: true,
        }"
        :modules="modules"
    >
        <swiper-slide v-for="(images, index) in resultImages" :key="index">
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
import {
    defineComponent,
    watch,
    watchEffect,
    toRefs,
    toRaw,
    Ref,
    ref,
} from "vue";
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
        canvasResults: Array,
        possibleDuplicatedImages: Array,
    },
    components: { Swiper, SwiperSlide, Slide },
    setup(props) {
        const resultImages = ref([]);

        /**
         * Returns the images to use in the slides
         */
        const getImages = () => {
            // To destructure props and don't lose reactivity we need to convert them into ref
            const { canvasResults, possibleDuplicatedImages } = props;

            const interval = setInterval(() => {
                if (
                    toRaw(canvasResults).length > 0 &&
                    toRaw(possibleDuplicatedImages).length > 0
                ) {
                    clearInterval(interval);
                    const duplicatedImages = toRaw(canvasResults);
                    const openCVImages = toRaw(possibleDuplicatedImages);

                    // In order to pass to a slide the images as: Array<Object> where [{imageFile, canvas}]
                    /**
                     * @type {Array<{ image: HTMLCanvasElement[], opencvResult: File[] }>}
                     */
                    const images = [];
                    for (let i = 0; i <= duplicatedImages.length; i++) {
                        images.push({
                            image: duplicatedImages[i],
                            opencvResult: openCVImages[i],
                        });
                    }
                    resultImages.value = images;
                }
            }, 50);
        };

        getImages();

        return {
            modules: [Autoplay, Keyboard, Pagination, Zoom, Navigation],
            resultImages,
        };
    },
});
</script>
