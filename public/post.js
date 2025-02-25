App.component('post', {
    props: {
        post: {
            required: true,
        },
        single: {
            required: false,
            default: false,
        },
    },
    data() {
        return {
            reportReason: '',
            admin: localStorage.getItem("role") === "admin",
        };
    },
    methods: {
        openReportModal(post) {
            const modalElement = document.getElementById('reportModal' + post.id);
            if (modalElement) {
                const modalInstance = new bootstrap.Modal(modalElement);
                modalInstance.show();
            } else {
                console.error('Modal element not found for post:', post);
            }
        },
        async reportPost(post) {
            const body = JSON.stringify({
                "id": post.id,
                "reason": this.reportReason
            });

            const response = await fetch('/api/community/posts/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem("jwt"),
                },
                body: body
            });

            if (response.ok) {
                alert('Post reported successfully to an admin. Check back soon for updates.');
            }
        }
    },
    template: `
    <div class="card-body">
        <h5 class="card-title">{{ post.title }}</h5>
        <p class="card-text">{{ post.content }}</p>
        <p v-if="single" id="admin-text" v-html="post.reported_reason"></p>
        <button class="btn btn-warning" @click="openReportModal(post)">Melden</button>

        <div class="modal fade" :id="'reportModal' + post.id" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Beitrag melden</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="reportReason">Grund der Meldung:</label>
                            <textarea class="form-control" v-model="reportReason" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
                        <button type="button" class="btn btn-primary" @click="reportPost(post)">Melden</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
});
