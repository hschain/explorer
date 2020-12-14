<template>
  <div :class="{ hidden: hidden }" class="small-pagination">
    <el-pagination
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default{
    name: "Pagination",
    props: {
      total: {
        required: true,
        type: Number
      },
      page: {
        type: Number,
        default: 1
      },
      limit: {
        type: Number,
        default: 20
      },
      hidden: {
        type: Boolean,
        default: true
      },
    },
    computed: {
      currentPage: {
        get() {
          return this.page;
        },
        set(val) {
          this.$emit('update:page', val);
        }
      },
      pageSize: {
        get() {
          return this.limit;
        },
        set(val) {
          this.$emit("update:limit", val);
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        this.$emit("pagination", { page: this.currentPage, limit: val });
      },
      handleCurrentChange(val) {
        this.$emit("pagination", { page: val, limit: this.pageSize });
      },
    }
  }
</script>

<style>
  .hidden {
    display: none;
  }
</style>
