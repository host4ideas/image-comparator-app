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
                <img :src="image" alt="Result image" />
            </swiper-slide>
            <swiper-slide>{{ takenImage }}</swiper-slide>
            <swiper-slide v-if="showOpencvResult">
                {{ opencvResult }}
            </swiper-slide>
        </swiper>
    </swiper-slide>
</template>
<script>
// Vue
import { defineComponent, watchEffect, ref, toRefs, toRaw } from "vue";
// Swiper
import { Pagination, Zoom, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper-bundle.css";
import "@ionic/vue/css/ionic-swiper.css";
// Capacitor
import { Preferences } from "@capacitor/preferences";

export default defineComponent({
    name: "Slide",
    props: {
        takenImage: HTMLImageElement,
        slideResults: Object,
    },
    components: { Swiper, SwiperSlide },
    setup(props) {
        const USER_PREFERENCES = "settings";
        const showOpencvResult = ref(false);
        const slideResultsProps = props;

        // If the user has setup that wants to visualize OpenCV result, show it
        Preferences.get({
            key: USER_PREFERENCES,
        }).then((settingsList) => {
            const settingsParsed = JSON.parse(settingsList.value);

            if (settingsParsed.showCanvasResult) {
                showOpencvResult.value = true;
            }
        });

        const { slideResults } = slideResultsProps;

        /**
         * @type {{ image: HTMLCanvasElement, opencvResult: File }}
         */
        const { image, opencvResult } = toRaw(slideResults);

        return {
            modules: [Pagination, Zoom, Navigation],
            image,
            opencvResult,
            showOpencvResult,
        };
    },
});
</script>
