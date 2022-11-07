<template>
    <swiper
        class="mySwiper swiper-h"
        :spaceBetween="50"
        :pagination="{
            clickable: true,
        }"
        :modules="modules"
    >
        <swiper-slide>Horizontal Slide 1</swiper-slide>
        <swiper-slide>
            <swiper
                class="mySwiper2 swiper-v"
                :direction="'vertical'"
                :spaceBetween="50"
                :pagination="{
                    clickable: true,
                }"
                :modules="modules"
            >
                <swiper-slide>Vertical Slide 1</swiper-slide>
                <swiper-slide>Vertical Slide 2</swiper-slide>
                <swiper-slide>Vertical Slide 3</swiper-slide>
                <swiper-slide>Vertical Slide 4</swiper-slide>
                <swiper-slide>Vertical Slide 5</swiper-slide>
            </swiper>
        </swiper-slide>
        <swiper-slide>Horizontal Slide 3</swiper-slide>
        <swiper-slide>Horizontal Slide 4</swiper-slide>
    </swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";

// Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";

import "swiper/swiper-bundle.css";
import "@ionic/vue/css/ionic-swiper.css";

// import required modules
import { Pagination } from "swiper";

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        return {
            modules: [Pagination],
        };
    },
};
</script>

<style scoped>
.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

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
    background: #eee;
}
</style>
