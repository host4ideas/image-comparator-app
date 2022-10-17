<template>
    <swiper
        class="mySwiper swiper-h"
        :spaceBetween="5"
        :pagination="{
            clickable: true,
        }"
        :modules="modules"
    >
        <swiper-slide v-for="(images, index) in getImages()" :key="index">
            <Slide :slideResults="images" />
        </swiper-slide>
    </swiper>
</template>
<style scoped>
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
import { defineComponent } from "vue";
// Swiper
import { Autoplay, Keyboard, Pagination, Zoom, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper-bundle.css";
import "@ionic/vue/css/ionic-swiper.css";
// Custom components
import Slide from "@/components/Slide.vue";

export default defineComponent({
    props: {
        slideResults: Array,
    },
    components: { Swiper, Slide, SwiperSlide },
    setup(props) {
        const getImages = () => {
            const images = [];
            const [canvasResults, possibleDuplicatedImages] =
                props.slideResults;

            for (let i = 0; i < canvasResults.length; i++) {
                console.log(canvasResults[i]);

                images.push({
                    image: possibleDuplicatedImages[i],
                    opencvResult: canvasResults[i],
                });
            }

            console.log(props.slideResults);
            console.log(canvasResults);
            console.log(possibleDuplicatedImages);
            console.log(images);

            return images;
        };

        return {
            modules: [Autoplay, Keyboard, Pagination, Zoom, Navigation],
            getImages,
        };
    },
});
</script>
