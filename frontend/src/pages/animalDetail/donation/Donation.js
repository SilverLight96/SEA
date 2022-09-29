import * as React  from 'react';
import { useState, useEffect } from "react"
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Button } from '@mui/material';
import CarouselImages from "../carousel/CarouselImages"
import api from "api/api.js"
import { useLocation } from "react-router-dom"
import DetailInfo from '../detailInfo/DetailInfo';
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Web3 from "web3"
import { Link, useNavigate } from "react-router-dom"

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function Donation(props) {
  const MySwal = withReactContent(Swal)
  const location = useLocation()
  const animalId = location.state.animalId
  const [animalInfo, setAnimalInfo] = useState({})
  const web3 = new Web3(window.ethereum);
  const [balance, setBalance] = useState();

  const getCurrentAccount = async() => {
    try {
      const currentAccounts = await web3.eth.getAccounts();
      // console.log(currentAccounts[0]);
      const bal = await web3.eth.getBalance(currentAccounts[0]);
      // console.log(balance);
      setBalance(bal/Math.pow(10,18));
      // console.log(web3);
      return currentAccounts[0];
    } catch {
      console.log("err");
    }
  }

  function enterMinting(e) {
    navigate("/main/minting", {state : {animalId : e.Id}})
  }

  const infoClick = () => {
    MySwal.fire({
      title: <p>{animalInfo.animalKoreanName}에게 기부하시겠습니까?</p>,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            icon: 'warning',
            timer: 1500
    }).then((result) => {  
      // donation : 내가 기부할 기부금 
      // balance : 잔고
      if (result.isConfirmed) {
        if(donation==null){
          Swal.fire('미입력', '토큰을 입력해주세요.<br />0.01 SSF 이상 기부 가능합니다.', 'error');
        }
        else if(balance<0.01){
          Swal.fire('잔액 미달', '토큰잔액이 최소 기부금 미달입니다.<br />충전 후 기부해주세요.', 'error')
        }
        else if(donation>balance){
          Swal.fire('잔액 부족', '잔액이 부족합니다. <br />충전 후 기부해주세요', 'error')
        }
        else if(donation<0.01){
          Swal.fire('최소 기부금 미달', '기부금은 0.01SSF 이상 가능합니다.<br />충전 후 기부해주세요.', 'error')
        }
        else if((animalInfo.animalMaxItem - animalInfo.animalNowItem)===0){
          Swal.fire('남아있는 NFT 기부 증서가 없습니다.', '기부 증서 없이 기부만 하시겠습니까?.', 'question')
        }
        else {
          Swal.fire(
            '기부가 완료되었습니다.', '감사합니다. </br>많은 기부 부탁드립니다.</br>Minting 페이지로 넘어갑니다.', 'success'
            ).then(() =>
            navigate("/main/minting", { state: { animalId: animalId } }));
        }
      } 
      else
      Swal.fire('진행 중단', '', 'error')
    })
  }

  const [donation, setDonation] = useState(null);
  
  const onChangeAccount = (e) => {
    setDonation({
      ...donation,
      [e.target.name]: e.target.value,
    });
  };   
  
  const navigate = useNavigate();

  useEffect(() => {
    api.animal.getAnimalDetail(animalId).then((res) => {
      setAnimalInfo(res.dto)
    })

    getCurrentAccount();
  }, [])


  return (

      <Grid container spacing={2} colums={12}>
        <Grid item xs={6}>
          <CarouselImages animalImgs={animalInfo.animalImg} ></CarouselImages>
        </Grid>
        <Grid item xs={6} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item><br/>
              <Typography variant="subtitle1" component="div" color="black">
                당신은 {animalInfo.animalKoreanName} 의 생존을 위해 기부하시려 합니다.<br />
                현재 {animalInfo.animalMaxItem - animalInfo.animalNowItem}개의 NFT가 남아 있습니다.<br/>
                NFT를 얻을 수 있는 최소 금액은 0.01 SSF입니다.<br/>
                </Typography>
                <br/>
                <Typography variant="body2" gutterBottom color="text.secondary">
                현재 잔고 : {balance} SSF
              </Typography>
            <Grid item>
              <Typography sx={{ cursor: 'pointer' }} variant="body2">
                  <input type="number" step="0.01" placeholder='기부금을 입력하세요' onChange={onChangeAccount}
                  oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"></input><br/>
                  <Button onClick={infoClick}
                    style={{
                      cursor: "pointer",
                    }}>
                  기부하기</Button>
              </Typography>
            </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
}











// window.location = "/main/minting";
          // <Link to={{
          //   pathname : `/main/minting`,   // `/animal/defail/{this.state.animal_id}`
          //   state : {
          //     animalId : this.state.animalId,
          //     animalKoreanName : this.state.animalKoreanName,
          //     animalEnglishName : this.state.animalEnglishName,
          //     animalScientificName : this.state.animalScientificName,
          //     animalDesc : this.state.animalDesc,
          //     animalMaxItem : this.state.animalMaxItem,
          //     animalNowItem : this.state.animalNowItem,
          //     animalImg : this.state.animalImg,
          //     animalYn : this.state.animalYn,
          //     animalEndangeredLevel : this.state.animalEndangeredLevel,
          //     animalType : this.state.animalType
          //   }
          // }}></Link>