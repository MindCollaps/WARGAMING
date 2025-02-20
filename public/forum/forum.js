const { createApp, ref } = Vue;

createApp({
    setup() {
        const posts = ref([]);
        const title = ref('');
        const content = ref('');
        const reportReason = ref('');
        getPosts();

        async function getPosts() {
            const response = await fetch('/api/forum/posts');
            const data = await response.json();
            posts.value = data.response;
        }

        async function createPost() {
            const body = JSON.stringify({
                "title": title.value,
                "content": content.value
            });

            const response = await fetch('/api/forum/posts/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (response.ok) {
                await getPosts();
                title.value = '';
                content.value = '';
            }
        }

        async function reportPost(post) {
            const body = JSON.stringify({
                "id": post.id,
                "reason": reportReason.value
            });

            const response = await fetch('/api/forum/posts/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (response.ok) {
                alert('Post reported successfully to an admin.');
            }
        }

        function openReportModal(post) {
            const modalElement = document.getElementById('reportModal' + post.id);
            if (modalElement) {
                const modalInstance = new bootstrap.Modal(modalElement);
                modalInstance.show();
            } else {
                console.error('Modal element not found for post:', post);
            }
        }

        return {
            posts,
            title,
            content,
            reportReason,
            createPost,
            reportPost,
            openReportModal
        };
    }
}).mount("#app");