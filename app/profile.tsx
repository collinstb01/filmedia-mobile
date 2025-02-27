import { View, Text, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import SubscriptionHeatmap from "../components/profile/SubscriptionHeatmap";
import LatestRelease from "../components/profile/LatestRelease";
import TopSongs from "../components/profile/TopSongs";
import Albums from "../components/profile/Albums";
import { SafeAreaView } from "react-native-safe-area-context";
import PaymentModal from "../components/PaymentModal";
import { ProfileFragment } from "@lens-protocol/client";
import {
  _getAWalletNFT,
  _getUserBalance,
  _getUserFromLocalStorage,
  _getWalletAddress,
  _isWalletAnArtist,
} from "../constants/_helperFunctions";
import { ethers } from "ethers";
import NFTs from "../components/NFTs";
import { lensClient } from "../constants/LensApi";
import { router } from "expo-router";

const profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [depositing, setDeposting] = useState(true);
  const [balance, setBalance] = useState("0");
  const [walletAddress, setwalletAddress] = useState("");
  const [handle, setHandle] = useState("");
  const [isArtist, setIsArtist] = useState(false);
  const [follower, setFollower] = useState({
    followers: 0,
    following: 0,
  });

  const [profile, setProfile] = useState<ProfileFragment | null>();
  // console.log(profile?.metadata?.displayName)

  useEffect(() => {
    const getProfile = async () => {
      const user: any = await _getUserFromLocalStorage();
      console.log(user);
      const profileById: any = await lensClient.profile.fetch({
        forHandle: `test/${user.name}`,
      });
      console.log("profileById", profileById?.followModule); // Add this line
      console.log("profile", profileById?.handle?.ownedBy);
      setProfile(profileById);
      setHandle(profileById?.handle?.localName);
      setFollower((_) => ({
        followers: profileById?.stats.followers,
        following: profileById?.stats.followers,
      }));
    };
    const getUserBalance = async () => {
      const walletAddress: string = await _getWalletAddress();

      setwalletAddress(walletAddress);
      const balance = await _getUserBalance({ userAddress: walletAddress });

      setBalance(balance.toString());
    };
    const getNFTByAddress = async () => {
      const nfts: any = await _getAWalletNFT();

      // setBalance(balance.toString());
    };

    const isAnArtist = async () => {
      const walletAddress: string = await _getWalletAddress();

      const isArtistBool = await _isWalletAnArtist({
        artistAddress: walletAddress,
      });
      setIsArtist(isArtistBool);
    };
    // isAnArtist();
    // getNFTByAddress();
    getProfile();
    getUserBalance();
  }, []);

  const uploadContent = () => {
    router.push("/upload");
  };
  return (
    <ScrollView
      style={{ flex: 1, minHeight: "100%", marginBottom: 789 }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 760, // Adjust padding as needed
      }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/19230155/pexels-photo-19230155/free-photo-of-a-little-boy-with-curly-hair-standing-outside.jpeg?auto=compress&cs=tinysrgb&w=300",
        }}
        className="h-[296px] object-cover"
        imageStyle={{ resizeMode: "cover" }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.01)", "#001F3F"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 180,
          }}
        />
      </ImageBackground>
      <View
        style={{
          position: "absolute",
          top: 135,
          right: 0,
          left: 0,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 40, fontWeight: "bold", color: "#fff" }}>
            {`@${handle}`}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#A8A8A8" }}>
            {`Welcome Back`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => uploadContent()}
            style={{
              marginTop: 29,
              paddingHorizontal: 24,
              backgroundColor: "#4169E1",
              paddingVertical: 8,
              alignItems: "center",
              justifyContent: "center",
              // width: "40%",
              marginRight: 4,
              borderRadius: 40,
            }}
            className="mx-auto"
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#fff" }}>
              Upload Content
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              marginTop: 29,
              paddingHorizontal: 24,
              backgroundColor: "#4169E1",
              paddingVertical: 8,
              alignItems: "center",
              justifyContent: "center",
              // width: "40%",
              borderRadius: 40,
            }}
            className="mx-auto"
          >
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#fff" }}>
              DEPOSIT
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <Text
            style={{ color: "white" }}
          >{`${follower.following} FOLLOWING`}</Text>
          <Text style={{ color: "white" }}> - </Text>
          <Text
            style={{ color: "white" }}
          >{`${follower.followers} FOLLOWERS`}</Text>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 29,
            paddingHorizontal: 24,
            backgroundColor: "#4169E1",
            paddingVertical: 8,
            alignItems: "center",
            justifyContent: "center",
            // width: "40%",
            // borderRadius: 40,
          }}
          className="mx-auto"
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#fff" }}>
            {`YOUR BALANCE ${walletAddress.slice(0, 4)}...${walletAddress.slice(
              -4
            )} : ${ethers.formatEther(balance)} ETH`}
          </Text>
        </TouchableOpacity>

        <View style={{ paddingTop: 9 }}>
          <NFTs />
        </View>
      </View>
      <PaymentModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        depositing={depositing}
        artirstAddress={""}
      />
    </ScrollView>
  );
};

export default profile;
