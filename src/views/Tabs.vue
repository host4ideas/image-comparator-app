<template>
    <ion-page>
        <ion-content>
            <ion-tabs>
                <ion-router-outlet></ion-router-outlet>
                <ion-tab-bar>
                    <!-- <ion-tab-button tab="tab1" href="/tabs/tab1">
                        <ion-icon :icon="triangle"></ion-icon>
                        <ion-label>Tab 1</ion-label>
                    </ion-tab-button> -->

                    <ion-tab-button tab="tab2" href="/tabs/tab2">
                        <ion-icon :icon="images" />
                        <ion-label>My Collection</ion-label>
                    </ion-tab-button>

                    <ion-tab-button tab="tab3" href="/tabs/tab3">
                        <ion-icon :icon="square" />
                        <ion-label>Collections Explorer</ion-label>
                    </ion-tab-button>
                </ion-tab-bar>
            </ion-tabs>
        </ion-content>
    </ion-page>
</template>

<script>
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonContent,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
} from "@ionic/vue";
import { images, square, triangle } from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";

import router from "../router/index";
import { onMounted } from "@vue/runtime-core";

export default {
    name: "Tabs",
    components: {
        IonContent,
        IonLabel,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonPage,
        IonRouterOutlet,
    },
    setup() {
        const USER_PREFERENCES = "settings";
        let settingsExist = false;

        const createSettings = () => {
            Preferences.set({
                key: USER_PREFERENCES,
                value: JSON.stringify({
                    myCollectionFolder: null,
                    showCanvasResult: false,
                }),
            });
            settingsExist = true;
        };
        onMounted(() => {
            // Check if there is a user selected My Collection folder to display
            Preferences.get({
                key: USER_PREFERENCES,
            })
                .then((settingsList) => {
                    const settings = JSON.parse(settingsList.value);

                    if (
                        settings == null ||
                        !settings.myCollectionFolder ||
                        !settings.showCanvasResult
                    ) {
                        createSettings();
                    } else {
                        settingsExist = true;
                    }
                })
                .catch((error) => {
                    if (
                        error.message ===
                        "Cannot read properties of undefined (reading 'get')"
                    ) {
                        createSettings();
                    } else {
                        console.log(error);
                    }
                });
        });
        return {
            images,
            square,
            triangle,
            handleClick(path) {
                if (settingsExist) router.push(path);
            },
        };
    },
};
</script>
