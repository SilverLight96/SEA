package com.sea.domain.donation.request;

import lombok.Getter;

@Getter
public class DonationRegisterPostReq {
	double donationAmount;
	String donationStatusCode;
	String donationTransactionHash;
	int animalId;
}