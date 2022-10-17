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
            <swiper-slide>Vertical Slide 1</swiper-slide>
            <swiper-slide>{{ slideResults.image }}</swiper-slide>
            <swiper-slide>{{ slideResults.opencvResult }}</swiper-slide>
        </swiper>
    </swiper-slide>
</template>
<style scoped>
.swiper {
    width: 100%;
    height: 100%;
}
</style>
<script>
// Vue
import { defineComponent } from "vue";
// Swiper
import { Pagination, Zoom, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper-bundle.css";
import "@ionic/vue/css/ionic-swiper.css";

export default defineComponent({
    props: {
        slideResults: Array,
    },
    components: { Swiper, SwiperSlide },
    setup() {
        return {
            modules: [Pagination, Zoom, Navigation],
        };
    },
});
</script>
