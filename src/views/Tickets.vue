<template>
    <div id="app">
        <div class="container">
            <div>
                <h1>LIST</h1>
            </div>
            <ticket-list></ticket-list>
        </div>
    </div>
</template>
<script>

    export default {
        components: {
            TicketList: () => import('./TicketList.vue'),
        },
        data() {
            return {
                currentUser: null
            };
        }
    };
</script>
