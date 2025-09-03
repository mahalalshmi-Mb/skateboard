import React from "react";
import { ViewPager, Frame, Track, View } from "react-view-pager";
import { useHistory } from "react-router-dom";

const animations = [
  {
    prop: "scale",
    stops: [
      [-50, 0.8],
      [0, 1],
      [50, 0.8],
    ],
  },
];

export default function Snap() {
  const navigateVar = useHistory();
  return (
    <ViewPager>
      <Frame>
        <Track
          viewsToShow={2}
          // infinite={true}
          align={0.5}
          animations={animations}
        >
          <View>
            <div
              onClick={() => {
                console.log("gyfgryu");
                navigateVar.push("/offer-details");
              }}
              className="card"
            >
              <div>
                Starbucks<p>10% Cashback on your purchase</p>
              </div>
            </div>
          </View>
          <View>
            <div
              onClick={() => {
                console.log("gyfgryu");
              }}
              className="card"
            >
              <div>
                Starbucks<p>10% Cashback on your purchase</p>
              </div>
            </div>
          </View>
          <View>
            <div
              onClick={() => {
                console.log("gyfgryu");
                navigateVar.push("/offer-details");
              }}
              className="card"
            >
              <div>
                Starbucks<p>10% Cashback on your purchase</p>
              </div>
            </div>
          </View>
          <View>
            <div
              onClick={() => {
                console.log("gyfgryu");
                navigateVar.push("/offer-details");
              }}
              className="card"
            >
              <div>
                Starbucks<p>10% Cashback on your purchase</p>
              </div>
            </div>
          </View>
          <View>
            <div
              onClick={() => {
                console.log("gyfgryu");
                navigateVar.push("/offer-details");
              }}
              className="card"
            >
              <div>
                Starbucks<p>10% Cashback on your purchase</p>
              </div>
            </div>
          </View>
          <View>
            <div
              onClick={() => {
                console.log("gyfgryu");
                navigateVar.push("/offer-details");
              }}
              className="card"
            >
              <div>
                Starbucks<p>10% Cashback on your purchase</p>
              </div>
            </div>
          </View>
          <View>
            <div
              onClick={() => {
                console.log("gyfgryu");
                navigateVar.push("/offer-details");
              }}
              className="card"
            >
              <div>
                Starbucks<p>10% Cashback on your purchase</p>
              </div>
            </div>
          </View>
        </Track>
      </Frame>
      <style jsx>{`
        .card {
          width: 440px;
          height: 300px;
          background-color: #731b47;
        }
      `}</style>
    </ViewPager>
  );
}
