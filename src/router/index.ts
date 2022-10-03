import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Tabs from "@/views/Tabs.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/tabs/tab2",
    },
    {
        path: "/tabs/",
        component: Tabs,
        children: [
            {
                path: "",
                redirect: "tab2",
            },
            // {
            //     path: "tab1",
            //     name: "Tab1",
            //     component: () => import("@/views/Tab1.vue"),
            // },
            {
                path: "tab2",
                name: "Tab2",
                component: () => import("@/views/Tab2.vue"),
            },
            {
                /* This will help us build the navigation inside our app by passing a folder name for the :folder parameter inside the path. */
                path: "tab3/:folder*",
                name: "Tab3",
                component: () => import("@/views/Tab3.vue"),
                props: ({ params }) => ({ folder: String(params.folder) }),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
