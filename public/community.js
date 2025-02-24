const { createApp, ref, onMounted  } = Vue;

const App = createApp({
    setup() {
        const posts = ref([]);
        const title = ref('');
        const content = ref('');
        const reportReason = ref('');
        const showPost = ref(false);
        const shownPost = ref({});

        onMounted(async () => {
            await getPosts();
            params();
        });

        function params() {
            const post = new URL(location.href).searchParams.get('post') ?? null;
            if (post) {
                showPost.value = true;
                for (const p of posts.value) {
                    if (post === p.id.toString()) {
                        shownPost.value = p;
                        return;
                    }
                }
            }
        }

        async function getPosts() {
            const response = await fetch(
                '/api/community/posts', 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': localStorage.getItem("jwt"),
                    }
                }
            );
            const data = await response.json();
            posts.value = data.response;
        }

        async function createPost() {
            const body = JSON.stringify({
                "title": title.value,
                "content": content.value
            });

            const response = await fetch('/api/community/posts/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem("jwt"),
                },
                body: body
            });

            if (response.ok) {
                await getPosts();
                title.value = '';
                content.value = '';
            }
        }

        return {
            posts,
            title,
            content,
            reportReason,
            createPost,
            showPost,
            shownPost,
        };
    }
});

App.mount("#app");