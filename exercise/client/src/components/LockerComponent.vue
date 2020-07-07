<template>
  <b-container fluid="sm" style="overflow-y: scroll">
    <b-table
      ref="lockingTable"
      :selectable="this.loading ? false : this.unlocking ? false : this.locking ? false : true"
      :select-mode="selectMode"
      :items="lockings"
      :fields="fields"
      @row-selected="onRowSelected"
      responsive="sm"
      :busy="isBusy"
      primary-key
    > 
      <template v-slot:cell(status)="data">
        <b-icon font-scale="1.5" :icon="data.item.status"></b-icon>
      </template>
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
    <p>
      <b-button :disabled="btnChooseDisabled"  variant="dark" @click="choose">
        <b-spinner v-if="loading || locking || unlocking" small type="grow"></b-spinner>
        {{this.loading ? 'Loading...' : this.locking ? 'Locking...' : this.unlocking ? 'Unlocking' : 'Choose'}}
      </b-button>
      <!-- <b-button size="sm" @click="choose">Choose</b-button> -->
    </p>
    <p class="warning">
      {{ warning }}
    </p>
    <div v-if="lockingProcess">
      <div role="group" v-if="chargeExtra">
        <label for="input-live">Additional Payment: {{this.extraCharge}}THB</label>
      </div>
      <div role="group">
        <label for="input-live">Insert Bill here:</label>
        <b-form-input
          id="input-live"
          v-model="bill"
          :state="billState"
          aria-describedby="input-live-help input-live-feedback"
          type="number"
          trim
        ></b-form-input>
        <!-- This will only be shown if the preceding input has an invalid state -->
        <b-form-invalid-feedback id="input-live-feedback">
          Insert one of these: 20 THB, 50 THB, 100 THB, 500 THB and 1000 THB
        </b-form-invalid-feedback>
      </div>
      <div role="group">
        <label for="input-live">Insert Coin here:</label>
        <b-form-input
          id="input-live"
          v-model="coin"
          :state="coinState"
          aria-describedby="input-live-help input-live-feedback"
          type="number"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Insert one of these: 1 THB, 2 THB, 5 THB, 10 THB
        </b-form-invalid-feedback>
      </div>
      <div role="group" v-if="chargeExtra == false">
        <label for="input-live">Set Password:</label>
        <b-form-input
          id="input-live"
          v-model="password"
          :state="passState"
          aria-describedby="input-live-help input-live-feedback"
          type="password"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">
          Use 6 characters
        </b-form-invalid-feedback>
        <b-form-text id="input-live-help">Use birthday to remember easily</b-form-text>
      </div>
       <p v-if="chargeExtra == false">
      <b-button :disabled="(!passState || !billState) && (!passState || !coinState)" size="sm" @click="handleAction('lock')">Lock</b-button>
    </p>
    </div>
     <div v-if="unlockingProcess">
    <div role="group">
      <label for="input-live">Enter Password to unlock:</label>
      <b-form-input
        id="input-live"
        v-model="passwordUnlock"
        :state="passStateUnlock"
        aria-describedby="input-live-help input-live-feedback"
        type="password"
        trim
      ></b-form-input>
      <b-form-invalid-feedback id="input-live-feedback">
        Use 6 characters
      </b-form-invalid-feedback>
      <b-form-text id="input-live-help">Enter correct password! (maybe birthday...)</b-form-text>
    </div>
    <div role="group" v-if="change>0 && passStateUnlock">
        <label for="input-live">Here is your change: {{ changes }}THB</label>
      </div>
     <p>
      <b-button :disabled="!passStateUnlock" size="sm" @click="handleAction('unlock')">Unlock</b-button>
    </p>
    </div>
    <b-modal id="modal-done" hide-footer>
      <template v-slot:modal-title>
        <div>Successfully <code>{{ currentStatus == 'lock' ? 'UNLOCK': 'LOCK' }}ED</code> Unit 
        <code>{{ currentUnit }}</code>
        </div>
      </template>
      <div class="d-block text-center">
        <h3 v-if="currentStatus == 'lock'">Thanks for using our system!</h3>
        <div v-if="currentStatus == 'unlock'">See you later!<br>
          <p class="grey-text">Do not forget your password to <code>unlock</code></p>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-contact" hide-footer>
      <template v-slot:modal-title>
        <div>Cannot Get Item Back </div>
      </template>
      <div class="d-block text-center">
        <h3>You need to pay <code>{{extraCharge}}THB</code> to UNLOCK</h3>
        <div>
          <p class="grey-text">Contact the staff for <code>extra</code> fee payment</p>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-data-changed" hide-footer>
      <template v-slot:modal-title>
        <div>Unit <code>{{currentUnit}}</code> just changed by another user</div>
      </template>
      <div class="d-block text-center">
        <h5>Please choose another unit</h5>
      </div>
    </b-modal>
  </b-container>  
</template>

<script>
import LockerService from '../LockerService';

export default {
  name: 'LockerComponent',
  props: ["status"],
  data() {
    return {
      error: '',
      text: '',
      fields: ['status','unit', 'size', {key:'firstprice', label: 'First Price(60min)'}, {key:'nextprice', label: 'Next 60 mins'}],
      lockings: [],
      selectMode: 'single',
      selected: [],
      isBusy: true,
      warning: '',
      btnChooseDisabled: true,
      bill: null,
      coin: null,
      password: '',
      passwordUnlock: '',
      lockingProcess: false,
      unlockingProcess: false,
      chargeExtra: false,
      change: 0,
      changes: [],
      extraCharge: 0,
      currentStatus: '',
      currentUnit: 0,
      loading: false,
      unlocking: false,
      locking: false
    }
  },
  async mounted() {
    try {
      this.lockings = await LockerService.getLockings();
      this.isBusy = false
      console.log("Select and click 'Choose'")
    }
    catch(err) {
      this.error = err.message;
    }
  },
  methods: {
      onRowSelected(lockings) {
        this.selected = lockings
        this.btnChooseDisabled = false
        this.unlockingProcess = false
        this.lockingProcess = false
        this.warning = ''
      },
      async choose() {
        this.loading = true
        try {
          this.lockings = await LockerService.getLockings();
        }
        catch(err) {
          this.error = err.message;
        }
        for(let i = 0; i<this.lockings.length; i++){
          if(this.selected[0].unit == this.lockings[i].unit){
            if (this.selected[0].status != this.lockings[i].status){
              this.currentUnit = this.lockings[i].unit
              this.$bvModal.show("modal-data-changed")
              this.loading = false
              return
            }
            this.selected[0] = this.lockings[i]
          }
        }
        this.loading = false
        this.chargeExtra = false
        var item = this.selected[0]
        this.currentUnit = item.unit
        this.currentStatus = item.status
        if(item.status == "lock"){
          this.unlockingProcess = true
          console.log("Enter password: " + item.password)
          var charge = this.calculatePayment(item.lockedDate)
          var paidBefore = item.payment
          console.log("charge: " + charge + "THB")
          console.log("paid before: " + paidBefore + "THB")
          this.extraCharge = charge
          if(paidBefore<charge){
            this.unlockingProcess = false
            this.chargeExtra = true
            console.log("additional payment...")
            console.log("please pay: " + (charge-paidBefore) + "THB. Contact the staff")
            this.extraCharge = charge-paidBefore
            this.$bvModal.show("modal-contact")
            this.$store.commit('setStatusColor', 'red')
            this.$store.commit('setStatusText', 'Please, pay extra to the staff!')
          }else if(paidBefore>charge) {
            var change = paidBefore - charge//950
            this.change = change
            var types = [1000,500,100,50,20,10,5,2,1]
            console.log("Changes are:")
            this.changes = this.calculateChange(types, change, )
            console.log("total change: " + this.change)
          }else {
            this.unlockingProcess = true
          }
        }else{
          this.chargeExtra = false
          this.lockingProcess = true
        }
      },
      calculateChange(types, change) {
        var changes = []
        var count = 0
        for(let i = 0; i<types.length; i++){
          count = 0
          if(change>=types[i]){
            while(change/types[i]>=1){
              change -= types[i]
              count ++
            }
            console.log(count + " x " + types[i])
            changes.push(`${count}x${types[i]}`)
          }
        }
        return changes
      },
      calculatePayment(lockedDate){
        var today = new Date().getTime()
        var lockedTime = new Date(lockedDate).getTime()
        var diff = (today-lockedTime)/1000
        diff /= 60 
        var lockMinutes = Math.abs(Math.round(diff))
        console.log("total minutes is: " + lockMinutes + "min")
        var charge = 0
        var firstprice = this.selected[0].firstprice
        var nextprice = this.selected[0].nextprice
        if(lockMinutes<61){
          charge = firstprice
        }else{
          charge += firstprice
          while(lockMinutes > 60){
            charge += nextprice
            lockMinutes -= 60
          }
        }
        return charge
      },
      async lock(id,unit,size,firstprice,nextprice) {
        let status = "lock"
        let payment = +this.bill + +this.coin
        let password = this.password
        this.locking = true
        await LockerService.updateLocking(id,unit,size,firstprice,nextprice,status,payment,password)
        this.lockings = await LockerService.getLockings();
        this.$bvModal.show("modal-done")
        this.locking = false
        this.$store.commit('setStatusColor', 'green')
        this.$store.commit('setStatusText', 'You have locked successfully!')

      },
      async unlock(id,unit,size,firstprice,nextprice) {
        let status = "unlock"
        let payment = 0
        let password = null
        this.unlocking = true
        await LockerService.updateLocking(id,unit,size,firstprice,nextprice,status,payment,password)
        this.lockings = await LockerService.getLockings();
        this.$bvModal.show("modal-done")
        this.unlocking = false
        this.$store.commit('setStatusColor', 'green')
        this.$store.commit('setStatusText', 'You have unlocked successfully!')
      },
      handleAction(action) {
        this.lockingProcess = false
        this.unlockingProcess = false
        this.btnChooseDisabled = true
        let id = this.selected[0]._id
        let unit = this.selected[0].unit
        let size = this.selected[0].size
        let firstprice = this.selected[0].firstprice
        let nextprice = this.selected[0].nextprice
        if(action == "lock"){
          this.lock(id,unit,size,firstprice,nextprice)
        }
        else{
          this.unlock(id,unit,size,firstprice,nextprice)
        }
        this.bill = null
        this.coin = null
        this.password = ''
        this.passwordUnlock = ''
      }
    },
  computed: {
    billState() {
      return this.bill == 20 || this.bill == 50 || this.bill == 100 || this.bill == 400 || this.bill == 500 || this.bill == 1000 ? true : false
    },
    coinState() {
      return this.coin == 1 || this.coin == 2 || this.coin == 5 || this.coin == 10 ? true : false
    },
    passState() {
      return this.password.length == 6 ? true : false
    },
    passStateUnlock() {
      return this.passwordUnlock == this.selected[0].password ? true : false
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.warning {
  color: red;
}
</style>
