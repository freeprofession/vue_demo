<template>
  <a-card :bordered="false">
    <a-table
      size="small"
      :columns="columns"
      :dataSource="Sequences"
      :pagination="{ pageSize: 60 }"
      :scroll="{ y: 400 }"
      bordered
    >
      <template v-for="col in ['coin', 'win']" slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input v-if="record.coin" :value="text" @change="e => handleChange(e.target.value, record.number, col)"/>
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.number)">保存</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.number)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.number)">编辑</a>
          </span>
        </div>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import STable from '@/components/table/'

const Sequences = [];
for (let i = 1; i < 100; i++) {
  Sequences.push({
    number: `A-${i}`,
    coin: `Edrward ${i}`,
    win: 32,
    ratio: `London Park no. ${i}`,
  });
}

export default {
  name: "test",
  components: {
    STable
  },
  data() {
    this.cacheData = Sequences.map(item => ({ ...item }));
    return{
      loading: false,
      editingKey: '',
      Sequences,
      columns: [
        {
          title: '机器编号',
          dataIndex: 'number',
          width: '15%',
        },
        {
          title: '投币数', 
          dataIndex: 'coin', 
          width: '20%',
          scopedSlots: { customRender: 'coin' }, 
        },
        {
          title: '出彩数',
          dataIndex: 'win',
          width: '20%',
          scopedSlots: { customRender: 'win' },
        },
        { 
          title: '出彩率',
          width: '20%',
          dataIndex: 'ratio',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '25%',
          scopedSlots: { customRender: 'action' },
        },    
      ],
    }
  },
  methods: {
    handleChange(value, key, col) {
      const newData = this.Sequences;
      const target = newData.filter(item => key === item.number)[0];
      if (target) {
        target[col] = value;
        this.Sequences = newData;
      }
    },
    edit(key) {
      const newData = this.Sequences;
      const target = newData.filter(item => key === item.number)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true
        this.Sequences = newData
      }
    },
    save(key) {
      const newData = this.Sequences;
      const newCacheData = this.cacheData;
      const target = newData.filter(item => key === item.number)[0];
      const targetCache = newCacheData.filter(item => key === item.number)[0];
      if (target && targetCache) {
        delete target.editable;
        this.Sequences = newData;
        Object.assign(targetCache, target)
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = this.Sequences;
      const target = newData.filter(item => key === item.number)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.number)[0]);
        delete target.editable;
        this.Sequences = newData;
      }
    },
  },
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
