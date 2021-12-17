export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test', description: '사용자 닉네임' })
  nickname: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'NO', description: '앱 진입시 백신 2차 접종 유무' })
  vaccination: Vaccination;

  @ApiProperty({ example: '1', description: '사용자 학교 ID' })
  univId: number;

  @ApiProperty({
    example: '서울특별시 서초구 신반포로 241',
    description: '사용자 위치(도로명 주소)',
  })
  address: string;

  @ApiProperty({ example: '123456789', description: '사용자 기기 ID' })
  deviceId: string;
}
