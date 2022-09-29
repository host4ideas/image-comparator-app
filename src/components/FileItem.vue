<template>
    <ion-item @click="itemClicked(f)">
        <ion-icon
            :name="f.isFile ? 'document-outline' : 'folder-outline'"
            slot="start"
        ></ion-icon>
        {{ f.name }}
    </ion-item>

    <!-- The start/end option buttons for all operations -->
    <ion-item-options side="start">
        <ion-item-option @click="deleteDocument(f)" color="danger">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
        </ion-item-option>
    </ion-item-options>

    <ion-item-options side="end">
        <ion-item-option @click="startCopy(f)" color="success">
            Copy
        </ion-item-option>
    </ion-item-options>
</template>

<script>
export default {
    props: {
        folderContent: [],
        itemClicked: Function,
        deleteDocument: Function,
        startCopy: Function,
    },
};
</script>
