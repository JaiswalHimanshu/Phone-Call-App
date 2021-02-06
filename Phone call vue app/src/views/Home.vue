<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card
              style="background-color:cadetblue"
              height="430px"
              class="elevation-12"
            >
              <v-card-text>
                <v-card height="400px">
                  <v-tabs v-model="tabs" fixed-tabs>
                    <v-tabs-slider></v-tabs-slider>
                    <v-tab href="#mobile-tabs-5-1" class="primary--text">
                      <v-icon>mdi-phone</v-icon>
                      From
                    </v-tab>

                    <v-tab href="#mobile-tabs-5-2" class="primary--text">
                      <v-icon>mdi-phone</v-icon>
                      To
                    </v-tab>

                    <v-tab href="#mobile-tabs-5-3" class="primary--text">
                      <v-icon>mdi-account-box</v-icon>
                    </v-tab>

                    <v-tab href="#mobile-tabs-5-4" class="primary--text">
                      <v-icon>mdi-alarm</v-icon>
                    </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tabs">
                    <v-tab-item :value="'mobile-tabs-5-1'">
                      <v-card flat>
                        <v-card-text>
                          <v-text-field
                            prepend-icon="mdi-account"
                            label="Name"
                            type="text"
                            v-model="callInfo.fromName"
                          ></v-text-field>
                          <v-text-field
                            prepend-icon="mdi-cellphone-android"
                            label="Number"
                            v-model="callInfo.fromNumber"
                          ></v-text-field>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                    <v-tab-item :value="'mobile-tabs-5-2'">
                      <v-card flat>
                        <v-card-text>
                          <v-text-field
                            prepend-icon="mdi-account"
                            label="Name"
                            type="text"
                            v-model="callInfo.toName"
                          ></v-text-field>
                          <v-text-field
                            prepend-icon="mdi-cellphone-android"
                            label="Number"
                            v-model="callInfo.toNumber"
                          ></v-text-field>
                          <v-text-field
                            prepend-icon="mdi-clock"
                            label="Duration in seconds"
                            type="number"
                            v-model="callInfo.duration"
                          ></v-text-field>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                    <v-tab-item :value="'mobile-tabs-5-3'">
                      <v-card flat>
                        <v-card-text>
                          <v-text-field
                            disabled
                            label="From"
                            v-model="callInfo.fromNumber"
                          ></v-text-field>
                          <v-text-field
                            disabled
                            v-model="callInfo.toNumber"
                            label="To"
                          ></v-text-field>
                          <v-text-field
                            disabled
                            label="Duration in seconds"
                            v-model="callInfo.duration"
                          ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn @click="initiateCall()" color="primary"
                            >Call</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-tab-item>
                    <v-tab-item :value="'mobile-tabs-5-4'">
                      <v-card class="mt-8" flat>
                        <v-card-text>
                          <p style="font-size:20px" align="center">
                            Call {{ status }}
                          </p>
                          <br /><br />

                          <p align="center">
                            <label style="font-size:80px" id="minutes">00</label
                            ><label style="font-size:80px">:</label
                            ><label style="font-size:80px" id="seconds"
                              >00</label
                            >
                          </p>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      tabs: "",
      callInfo: {
        fromName: "",
        toName: "",
        fromNumber: "",
        toNumber: "",
        duration: "",
        callId: "",
      },
      status: "pending",
      startTimer: true,
    };
  },
  methods: {
    pad(val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    },
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    initiateCall() {
      let self = this;
      self.callInfo.callId = self.makeid(8);
      self.tabs = "mobile-tabs-5-4";
      self.$conn.initiateCall(self.callInfo).then(
        () => {
          let timerInterval;
          var myInterval = setInterval(async function myTimer() {
            await self.$conn.getCallStatus(self.callInfo.callId).then(
              (status) => {
                console.log(status.data.Item.call_status);
                self.status = status.data.Item.call_status;
                if (self.status === "in-progress" && self.startTimer) {
                  self.startTimer = false;
                  var minutesLabel = document.getElementById("minutes");
                  var secondsLabel = document.getElementById("seconds");
                  var totalSeconds = 0;
                  timerInterval = setInterval(function setTime() {
                    ++totalSeconds;
                    secondsLabel.innerHTML = self.pad(totalSeconds % 60);
                    minutesLabel.innerHTML = self.pad(
                      parseInt(totalSeconds / 60)
                    );
                  }, 1000);
                } else if (self.status === "completed") {
                  clearInterval(myInterval);
                  clearInterval(timerInterval);
                }
              },
              (err) => {
                console.log(err);
                alert("Something went wrong");
              }
            );
          }, 2000);
        },
        (err) => {
          console.log(err);
          alert("Something went wrong");
        }
      );
    },
  },
};
</script>
