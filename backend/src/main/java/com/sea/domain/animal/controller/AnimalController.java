package com.sea.domain.animal.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sea.common.auth.UserDetails;
import com.sea.common.model.response.BaseResponseBody;
import com.sea.domain.animal.dto.AnimalDto;
import com.sea.domain.animal.dto.AnimalNameDto;
import com.sea.domain.animal.dto.MyAnimalDto;
import com.sea.domain.animal.request.AniamlRegisterPostReq;
import com.sea.domain.animal.response.AnimalDetailGetRes;
import com.sea.domain.animal.response.AnimalListGetRes;
import com.sea.domain.animal.response.AnimalNameListGetRes;
import com.sea.domain.animal.response.MyListGetRes;
import com.sea.domain.animal.service.AnimalService;
import com.sea.domain.user.db.entity.User;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

@Slf4j
@RestController
@RequestMapping("/api/vi/animal")
public class AnimalController {

	@Autowired
	AnimalService animalService;
	
	@PostMapping()
	public ResponseEntity<? extends BaseResponseBody> registerAniaml(@RequestBody AniamlRegisterPostReq registerInfo) {
		
		try {
			animalService.registerAnimal(registerInfo);
		} catch(Exception e) {
			return ResponseEntity.status(400).body(BaseResponseBody.of(400, "Failed"));
		}
		
		return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
	}

	// READ
	@ApiOperation(value = "동물조회")
	@GetMapping()
	@ApiResponses({ @ApiResponse(code = 200, message = "성공", response = AnimalListGetRes.class), })
	public ResponseEntity<? extends BaseResponseBody> getProductList(
			@PageableDefault(page = 0, size = 10) Pageable pageable) {
		log.info("getProductList - 호출");

		Page<AnimalDto> animals = animalService.getAnimalList(pageable);

		return ResponseEntity.status(200).body(AnimalListGetRes.of(200, "Success", animals));
	}

	@ApiOperation(value = "동물 상세보기")
	@GetMapping("/{animalNo}")
	public ResponseEntity<? extends BaseResponseBody> animalDetail(
			@ApiParam(value = "동물키") @PathVariable("animalNo") int animalNo) {
		log.info("animalDetail - 호출");

		AnimalDto dto = animalService.animalDetail(animalNo);

		return ResponseEntity.status(200).body(AnimalDetailGetRes.of(200, "Success", dto));
	}

	// /name-list
	@GetMapping("/name-list")
	@ApiOperation(value = "동물 이름 리스트")
	@ApiResponses({ @ApiResponse(code = 200, message = "성공", response = AnimalNameListGetRes.class),

	})
	public ResponseEntity<? extends BaseResponseBody> getAnimalListByName() {

		log.info("productTitle - 호출");
		List<AnimalNameDto> list = animalService.getAnimalListByName();

		return ResponseEntity.status(200).body(AnimalNameListGetRes.of(200, "Success", list));
	}

	// /my-list
	@GetMapping("/my-list")
	@ApiOperation(value = "내가 기부한 동물 리스트")
	@ApiResponses({ @ApiResponse(code = 200, message = "성공", response = AnimalDto.class),

	})
	public ResponseEntity<? extends BaseResponseBody> getMyList(@ApiIgnore Authentication authentication, Principal principal) {
		UserDetails userDetails = (UserDetails) authentication.getDetails();
		User user = userDetails.getUser();
		
		List<MyAnimalDto> list = animalService.getMyAnimalListByUserName(user);

		return ResponseEntity.status(200).body(MyListGetRes.of(200, "Success", list));
	}
}
