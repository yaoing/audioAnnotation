<template>
  <div class="container">

    <div class="menu">
      <div>
        <el-button type="text" @click="help=true"
                   style="cursor: pointer;color: #3893e8" >使用指南</el-button>

        <el-button type="text" @click="clarify=true"
                   style="cursor: pointer;color: #3893e8" >免责声明</el-button>
      </div>

      <el-tooltip placement="left-end" effect="light">
        <div slot="content" style="font-size: 12px">
          手机号:{{userInfo.tel}}<br>
          有效标注量:{{userInfo.count}}
        </div>
        <el-button type="text" style="font-size: 20px;" @click="queryCount">
          <i v-show="this.userInfo.tel" class="el-icon-user-solid"></i>
        </el-button>
      </el-tooltip>

    </div>

    <div id="text-box">
      <div style="margin: auto;display: flex;flex-flow: wrap row">
        <div class="text-block" v-for="(word,index) in data[activeIndex].text" :key="index">
          <div class="texts">{{word}}</div>
          <div class="prons">{{data[activeIndex].pron[index]}}</div>
        </div>
      </div>
    </div>

    <div id="item-bar">
      <div v-for="(item,index) in data" :key="index"
           :class="{selectedBtn:index==activeIndex}" @click="changeBtn(index)">{{index+1}}</div>
    </div>
    <div id="tip-bar">
      <p v-if="recording">正在录音...</p>
      <p v-else-if="!haveAudio">点击按钮录音 或</p>
      <p v-else>进入下一条 或</p>
      <el-button v-if="!haveAudio" type="text" @click="renewOne"
                 style="cursor: pointer;color: #3893e8" ><i class="el-icon-refresh-left"></i> 跳过该条</el-button>
      <el-button v-else  type="text" @click="playAudio"
                 style="cursor: pointer;color: #3893e8"><i class="el-icon-phone-outline"></i> 试听录音</el-button>
    </div>



    <div id="audio-bar">

      <el-tooltip :value="data[activeIndex].wavLen" effect="dark" placement="left-end">
        <div slot="content" v-if="data[activeIndex].wavLen<1.5">
          录音太短<br>建议重录哦~
        </div>
        <div slot="content" v-else>
          用时{{data[activeIndex].wavLen}}秒<br>可进入下一条哦~
        </div>
        <el-button style="width:1px;height:1px;padding: 0;visibility: hidden"></el-button>
      </el-tooltip>

      <div id="record" :class="{btnMd:recording}" @click="clickRecordBtn" >
        <i v-if="!recording" class="el-icon-microphone"></i>
        <i v-else class="el-icon-loading"></i>
      </div>

    </div>
    <audio style="visibility: hidden" ref="audioPlayer"></audio>

    <div id="aside-bar">
      <div class="asideBtn" @click="submit">提交数据</div>
    </div>

    <div id="footer">
      <!--            <div id="clientID">ID:{{userInfo.client}}</div>-->
      <el-progress :percentage="percentage" :stroke-width="12" text-inside style="width: 30%"></el-progress>

      <div><strong>剩余量: {{position[0]}}</strong></div>
    </div>



    <el-dialog
            title="使用说明"
            :visible.sync="help"
            width="300px"
            center>
      <p>1.根据页面显示的句子和福州话注音朗读。正式录音前可以试读一下。</p >
      <p>2.每页显示三句话，通过点击① ② ③ 按钮切换句子。</p >
      <p>3.点击（无需长按）录音按钮开始录音，朗读结束，点击同样按钮结束语音采集。</p >
      <p>4.若完成一页朗读或需要离开页面，务必点击<strong>提交数据</strong>按钮。提交后系统会自动分配新句子，直至全部句子录制完成。</p >
      <p>5.<strong>严格</strong>按照单词的福州话注音朗读，无注音单词请参照普通话拼音以福州话腔调朗读。“134”等数字读“一三四”而非“一百三十四”。</p >
      <p>6.朗读要求准确和流利，无漏读、错读、加字、停顿等。</p >
      <p>7.登陆后可点击右上角图标查看个人有效标注量,页面底部显示当前语料标注进度。</p >
    </el-dialog>

    <el-dialog
            title="免责声明"
            :visible.sync="clarify"
            width="300px" :show-close="false"
            center>
      <p>本平台所使用的文本语料皆由比赛官方提供,该语料可能包含部分政治、广告相关场景，本平台对其概不负责，亦不承担任何法律责任！</p>
      <p>您可以选择不使用该平台功能，但如果您选择使用，您的使用行为将被视为对本声明全部内容的认可。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="clarify = false" size="medium">同意并使用</el-button>
      </span>
    </el-dialog>

    <el-dialog title="绑定手机号" :visible.sync="register"
               width="300px" :show-close="false"
               :close-on-press-escape="false"
               :close-on-click-modal="false">
      <div>

        <p>为方便后台统计与发放酬劳，请在下方输入您的手机号(用完销毁)：</p>


        <el-form :model="registerForm" ref="registerForm">
          <el-form-item
                  label="手机号"
                  prop="telNumber"
                  :rules="[
      { required: true, message: '不能为空'},
      { type: 'number', message: '必须为数字值'}
    ]"
          >
            <el-input type="text" placeholder="请输入手机号" maxlength="11" show-word-limit
                      v-model.number="registerForm.telNumber" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tryRegister(registerForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {v1 as uuid} from 'uuid';
  import Cookies from 'js-cookie'
  import Recorder from 'recorder-js';
  import api from '../api'

  export default {
    name: 'Annotator',
    data(){
      return {

        data:[{
          'text':null,
          'pron':null,
          'audio':null
        }],
        position:[0,0],
        activeIndex:0,

        recording:false,

        recorder:null,
        haveAudio:false,

        clarify:false,
        help:false,
        register:false,

        startAt:null,
        endAt:null,

        userInfo:{
          'client':null,
          'tel':null,
          'count':0
        },
        registerForm: {
          telNumber: ''
        },

        percentage:1,

      }
    },
    methods:{
      changeBtn(index){

        if(this.data[this.activeIndex].audio && index == this.activeIndex+1)
          this.activeIndex=index
        else if (index < this.activeIndex)
          this.activeIndex=index
        else if (index > this.activeIndex && this.data[index-1].audio){

          this.activeIndex=index
        }
      },
      tryLogin(){
        api.login({uid:this.userInfo.client}).then(({data:{code,tel}})=>{
          if(code==200)
            this.userInfo.tel = tel
        })
      },
      tryRegister(form){
        this.$refs['registerForm'].validate((valid) => {
          if (valid && form.telNumber.toString().length==11) {
            api.register({uid:this.userInfo.client,tel:form.telNumber}).then(({data:{code}})=>{
              if(code==200)
                this.userInfo.tel = form.telNumber
              this.register = false

            })
          }
        });
      },

      queryCount(){
        api.queryCount({tel:this.userInfo.tel}).then(({data:{code,count}})=>{
          if(code==200)
            this.userInfo.count = count
        })
      },
      setCookie(){
        if(Cookies.get('client')==undefined){
          var uid = uuid().split("-").join("")
          Cookies.set('client', uid, { expires: 1314 })
        }

        this.userInfo.client = Cookies.get('client')

        if(Cookies.get('clarify')==undefined){
          this.clarify = true
          Cookies.set('clarify', 1, { expires: 0.5 })
        }

      },
      getTextList(){
        api.getTextList().then(({data:{data,code,position}})=>{
          if(code==200)
            this.data = data
          this.activeIndex = 0
          this.position = position

          this.percentage = parseInt((1-this.position[0] /this.position[1])*100)
        })
      },

      renewOne(){
        var excludes = []
        for (let i=0;i<this.data.length;++i){
          if (i != this.activeIndex)
            excludes.push(this.data[i].id)
        }
        api.getTextList(1,excludes).then(({data:{data,code,position}})=>{
          if(code==200){
            this.$set(this.data,this.activeIndex,data[0])
            this.position = position

            this.percentage = parseInt((1-this.position[0] /this.position[1])*100)
          }
        })
      },
      submit(){
        var count = 0
        for (let i=0;i<this.data.length;++i){
          if (this.data[i].audio) count++
        }

        for (let i=0;i<this.data.length;++i){

          if (!this.data[i].audio)
            continue

          var form = new FormData()

          form.append('data',this.data[i].audio,
                  `${this.data[i].id}-${this.userInfo.client}.wav`)

          api.uploadAudios(form).then(({data:{code}})=>{
            if(code==200 && i==count-1) {
              this.$message({
                message:`成功提交${count}条了录音!`,
                type:'success',
                duration:1000
              })

              this.getTextList()

              if(!this.userInfo.tel){
                this.register = true
              }
            }
          }).catch(()=>{
            this.$message.error('提交失败,请重试!')
            return 0
          })
        }

      },
      clickRecordBtn() {
        if(this.recording==false)
          this.startRecording()
        else
          this.stopRecording()
      },
      startRecording() {
        this.recorder.start()
                .then(() => {
                  this.startAt = new Date()
                  this.recording = true

                })
                .catch(error => {
                  console.log("Recording failed.", error);
                });

      },
      stopRecording(){

        setTimeout(()=>{
          this.recording = false

          this.recorder.stop()
                  .then(({blob}) => {

                    this.endAt = new Date()
                    this.$set(this.data[this.activeIndex],'wavLen',(this.endAt-this.startAt)/1000)
                    this.pushData(blob)
                  });
        },100)


      },
      pushData(blob){
        // this.data[this.activeIndex].audio = blob
        this.$set(this.data[this.activeIndex],'audio',blob)
      },

      playAudio(){
        var el = this.$refs.audioPlayer
        var link = URL.createObjectURL(this.data[this.activeIndex].audio)
        el.src = link

        el.currentTime = 0
        el.play()
      }
    },
    created() {
      this.setCookie()

      this.getTextList()

      this.tryLogin()

      window.AudioContext = window.AudioContext || window.webkitAudioContext;

      var audioContext = new AudioContext();
      this.recorder = new Recorder(audioContext);

      navigator.mediaDevices.getUserMedia({audio: true})
              .then(stream => this.recorder.init(stream))
              .catch(err => console.log('Uh oh... unable to get stream...', err));



    },
    watch:{
      data:{
        handler(newD){
          this.haveAudio = newD[this.activeIndex].audio == undefined ? false : true
        },
        deep:true
      },
      activeIndex:{
        handler(newIndex){
          this.haveAudio = this.data[newIndex].audio == undefined ? false : true
        }
      }
    }
  }
</script>

<style scoped>
  .container{
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-flow: nowrap column;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem .3rem;

    background-color: #DCDCDC;
  }
  .menu{
    width: 90%;
    height: 40px;
    line-height: 40px;
    display: flex;
    flex-flow: nowrap row;
    justify-content: space-between;
  }
  #text-box{
    width: 45rem;
    min-height: 10rem;
    max-height: 12rem;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    font-size: 2rem;
    background-color: white;
    color:black;
    padding: 0 1rem;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  }

  .text-block{
    display: flex;
    flex-flow: nowrap column;
    width: max-content;
    margin: 0.3rem;

  }

  .texts{
    display: flex;
    flex-flow: nowrap row;
    align-content: space-between;

    animation: fade-in .5s 0s ease;
  }
  .prons{
    line-height: 0.9rem;
    font-size: 0.9rem;
    color: #606266;
  }

  #item-bar{
    width: 25rem;
    height: 5rem;

    display: flex;
    flex-flow: nowrap row;

    justify-content: space-between;
  }


  #item-bar >div{
    width: 3rem;
    height: 3rem;
    line-height: 3rem;

    cursor: pointer;
    background-color: #fffdfe;

    border-radius: 50%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .selectedBtn{
    background-color: #3B9AF4 !important;
    color: white;
  }

  #tip-bar{
    font-size: 17px;
    color: #505457;
    text-align: center
  }

  #tip-bar>p{
    margin: 0;
  }

  #audio-bar{
    width: 20rem;
    height: 6rem;

    display: flex;
    flex-flow: nowrap row;
    justify-content: center;

  }

  #record{
    width: 4.5rem;
    height: 4.5rem;

    line-height: 4.5rem;

    font-size: 2.5rem;
    cursor: pointer;
    background-color: gray;
    color: white;
    border-radius: 50%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  }

  #play{
    width: 4.5rem;
    height: 4.5rem;

    line-height: 4.5rem;

    font-size: 2.5rem;
    cursor: pointer;
    background-color: gray;
    color: white;
    border-radius: 50%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    margin-left:3rem
  }

  #record:hover{
    font-size: 3rem;
    transition: all .2s;
  }


  #play:hover{
    font-size: 3rem;
    transition: all .2s;
  }

  .btnMd{
    background-color: #87CEFA;
  }

  #upload{
    height: 2.5rem;
  }

  #footer{
    width: 100%;
    display: flex;
    flex-flow: nowrap row;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    bottom: 0;
    left: 0;

    font-size: 12px;

  }

  #clientID{
    /*user-select: all !important;*/
  }


  #aside-bar{
    /*position: sticky;*/
    /*right: 10%;*/
    /*bottom: 10%;*/

  }

  .asideBtn{
    width: 5rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    border-radius: 5px;
    font-size: 14px;

    cursor: pointer;

    background-color: #3c9cf6;
    color: white;
  }
  @media screen and (max-width: 768px) {

    .container{
      padding:1rem 1rem .5rem;
    }
    #text-box{
      width: 20rem;
      min-height: 8rem;
      max-height: 10rem;
      display: flex;
      flex-direction: row;
      justify-items: center;
      align-items: center;
      font-size: 1.3rem;
      padding: 0 .5rem;

    }

    .text-block{
      display: flex;
      flex-flow: nowrap column;
      width: max-content;
      margin: 0 0.2rem;

    }

    .texts{
      display: flex;
      flex-flow: nowrap row;
      align-content: space-between;
    }
    .prons{
      line-height: .5rem;
      font-size: 0.7rem;
      color: #606266;
    }

    #item-bar{
      width: 15rem;

    }

    .asideBtn{
      width: 25px;
      height: auto;
      margin: 0 auto;
      line-height: 19px;
      font-size: 14px;
      position: fixed;
      right: 0;
      bottom: 25%;
      font-size: 14px;
      border-radius: 0;
      padding: 5px;
      /*border-top-left-radius: 5px;*/
      /*border-bottom-left-radius: 5px;*/

    }
  }



  .fade-enter-active, .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
