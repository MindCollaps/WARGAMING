const { createApp, ref } = Vue;

createApp({

    async navigateForum() {
        window.location.href = '/Forum'
    }


}).mount("#app");