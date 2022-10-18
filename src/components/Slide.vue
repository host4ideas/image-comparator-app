<template>
    <swiper-slide>
        <swiper
            class="mySwiper2 swiper-v"
            :direction="'vertical'"
            :pagination="{
                clickable: true,
            }"
            :modules="modules"
        >
            <!-- Vertical slides -->
            <swiper-slide>Vertical Slide 1</swiper-slide>
            <swiper-slide>
                <img :src="slideResults.image" alt="Result image" />
            </swiper-slide>
            <swiper-slide v-html="slideResults.opencvResult"></swiper-slide>
        </swiper>
    </swiper-slide>
</template>
<script>
// Vue
import { defineComponent, watchEffect } from "vue";
// Swiper
import { Pagination, Zoom, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper-bundle.css";
import "@ionic/vue/css/ionic-swiper.css";

export default defineComponent({
    props: {
        slideResults: Object,
    },
    components: { Swiper, SwiperSlide },
    setup(props) {
        console.log(props.slideResults);

        return {
            modules: [Pagination, Zoom, Navigation],
        };
    },
});
</script>
