<template>
    <!-- <swiper
        class="mySwiper swiper-h"
        :spaceBetween="50"
        :pagination="{
            clickable: true,
        }"
        :modules="modules"
    >
        <swiper-slide v-for="(results, index) in resultImages" :key="index">
            <swiper
                class="mySwiper2 swiper-v"
                :direction="'vertical'"
                :spaceBetween="50"
                :pagination="{
                    clickable: true,
                }"
                :modules="modules"
            >
                <swiper-slide
                    ><img
                        src="https://concepto.de/wp-content/uploads/2015/03/paisaje-800x409.jpg"
                        alt=""
                /></swiper-slide>
                <swiper-slide v-html="results.image"></swiper-slide>
                <swiper-slide>
                    {{ takenImage }}
                </swiper-slide>
                <swiper-slide v-if="showOpencvResult">
                    <img
                        :src="convertBlobToBase64(results.opencvResult)"
                        alt="OpenCV result"
                    />
                </swiper-slide>
            </swiper>
        </swiper-slide>
    </swiper> -->
    {{ takenImage }}
    {{ resultImages[0]?.image }}
    {{ resultImages[0]?.opencvResult }}
</template>
<style>
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
<script>
// Vue
import { defineComponent, toRaw, ref } from "vue";
// Swiper
import { Keyboard, Pagination, Zoom, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue";
import "swiper/swiper-bundle.css";
import "@ionic/vue/css/ionic-swiper.css";
// Capacitor
import { Preferences } from "@capacitor/preferences";
import { Filesystem, Directory } from "@capacitor/filesystem";

export default defineComponent({
    props: {
        takenImage: HTMLImageElement,
        canvasResults: Array,
        possibleDuplicatedImages: Array,
    },
    components: {
        // Swiper,
        // SwiperSlide,
    },
    setup(props) {
        const USER_PREFERENCES = "settings";
        const APP_DIRECTORY = Directory.Documents;
        const showOpencvResult = ref(false);
        const resultImages = ref([]);

        const getProxyValue = () => {
            const { canvasResults, possibleDuplicatedImages } = props;

            let count = 0;

            return new Promise((res, rej) => {
                const interval = setInterval(() => {
                    count += 1;
                    if (
                        toRaw(canvasResults).length > 0 &&
                        toRaw(possibleDuplicatedImages).length > 0
                    ) {
                        clearInterval(interval);
                        res({ canvasResults, possibleDuplicatedImages });
                    } else if (count > 10) {
                        // Lapsed more than 500ms
                        rej("Empty results");
                    }
                }, 50);
            });
        };

        /**
         * Sets the resultsImages ref to the array of images to show in the slides
         */
        const getImages = async () => {
            /**
             * @type {Array<{ image: HTMLCanvasElement[], opencvResult: File[] }>}
             */
            const resultImages = [];

            try {
                const { canvasResults, possibleDuplicatedImages } =
                    await getProxyValue();

                // In order to pass to a slide the images as: Array<Object> where [{imageFile, canvas}]
                for (let i = 0; i <= canvasResults.length; i++) {
                    resultImages.push({
                        image: canvasResults[i],
                        opencvResult: possibleDuplicatedImages[i],
                    });
                }
            } catch (error) {
                console.log("No images to compare");
                return;
            }

            console.log(resultImages);

            return resultImages;
        };

        /**
         * Convert File to base64 string
         */
        const convertBlobToBase64 = (blob) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });
        };

        const getImageFromStorage = async (entry) => {
            console.log(entry);

            const file = await Filesystem.readFile({
                directory: APP_DIRECTORY,
                path: entry.uri,
            });
            return file.data;
        };

        getImages().then((results) => {
            // If the user has setup that wants to visualize OpenCV result, show it
            Preferences.get({
                key: USER_PREFERENCES,
            }).then((settingsList) => {
                const settingsParsed = JSON.parse(settingsList.value);

                if (settingsParsed.showCanvasResult) {
                    showOpencvResult.value = true;
                }
            });

            resultImages.value = results;

            console.log(results);
        });

        return {
            modules: [Pagination, Zoom, Navigation, Keyboard],
            resultImages,
            showOpencvResult,
            convertBlobToBase64,
            getImageFromStorage,
        };
    },
});
</script>
