<template>
    <v-row>
        <div class="pagination" id="container">
            <a href="#" @click="getFirstPage()">&laquo;&laquo;</a>
            <a href="#" @click="getPrevPage()">&laquo;</a>
            <a v-for="index in lastTwo" :key="index"
                :class="index === getCurrentPage()
                ? 'active' : 'notActive'" href="#" 
                @click="setPage(index)">{{ index }}</a>
            <a href="#" @click="getNextPage()">&raquo;</a>
            <a href="#" @click="getLastPage()">&raquo;&raquo;</a>
        </div>
    </v-row>
</template>

<script>
import { ref, onMounted } from 'vue';
import { mapState } from 'vuex';
import store from '@/stores/PaginationStore';

var lastTwo = ref(3);
var firstTwo = ref(0);

export default {
    computed: {
        ...mapState(['currentPage'])
    },
    props: {
        totalItems: Number
    },
    data() {
        return {
            firstTwo,
            lastTwo: this.totalItems+1,
        }
    },
    methods: {
        getCountOfPages() {
            this.writeDebugCode('getCountOfPages');
            return Math.ceil(countList.length / countPerPage);
        },
        getNextPage() {
            if (store.state.currentPage == this.getTotalPages()) {
                this.writeDebugCode('getNextPage');
                store.state.currentPage = this.getTotalPages();
            } else {
                store.state.currentPage ++
            }
        },
        getPrevPage() {
            this.writeDebugCode('getPrevPage');
            if (this.getCurrentPage() <= 1) {
                store.state.currentPage = 1;
            }
            else store.state.currentPage--
        },
        getFirstPage() {
            this.writeDebugCode('getFirstPage');
            store.state.currentPage  = 1;
        },
        getTotalPages() {
            return this.totalItems+1;
        },
        getLastPage() {
            this.writeDebugCode('getLastPage');
            store.state.currentPage = getTotalPages();
        },
        range(min, max) {
            this.writeDebugCode('range');
            var array = [], j = 0;
            min = store.state.currentPage - 1, max = store.state.currentPage + 1

            if (max >= this.getTotalPages()) {
                max = this.getTotalPages() - 1;
            }
            console.log('Legkisebb: ' + min)
            console.log('max: ' + max)
            if (store.state.currentPage >= 2 && 
                store.state.currentPage <= 
                this.getTotalPages()) {
                min = min - 1
            }
            for (var i = min; i <= max; i++) {
                array[j] = i;
                j++;
            }
            return array;
        },
        setPage(page) {
            this.writeDebugCode('setPage');
            store.state.currentPage = page
        },
        getCurrentPage() {
            return store.state.currentPage;
        },
        writeDebugCode(from) {
            console.log('from: ' + from + "jelenlegi: " + this.getCurrentPage() + "total: " + this.getTotalPages())
        }
    }
}
</script>

<style scoped>
#container{
  padding-top:20px;
  margin-top:20px;
  width:100vw;
  color:white;
  display:flex;
  align-items:center;
}
.pagination {
    display: inline-block;
    margin-bottom: 150px;
    padding-inline: 30%;
}

footer {
    display: flex;
    background-color: #42b942;
    height: 50px;
    width: 100%;
    position: fixed;
}

.pagination a {
    color: black;
    float: left;
    margin-top: 40px;
    margin-inline: auto;
    padding: 8px 16px;
    text-decoration: none;
    align-items: center;
    transition: background-color .3s;
}

.pagination a.notActive {
    color: black;
}

/* Style the active/current link */
.pagination a.active {
    background-color: dodgerblue;
    color: white;
}

/* Add a grey background color on mouse-over */
.pagination a:hover:not(.active) {
    background-color: #ddd;
}
</style>