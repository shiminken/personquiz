// @ts-nocheck
import styled from "@emotion/styled";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ContactValues } from "../../services/contact.type";
import FormInputGroup from "./FormInputGroup";
import colors from "../../constants/colors";
import { sendResultToUser, writeDataToSheet } from "../../services/results";
import useFeedback from "../../hooks/useFeedbacks";
import useThankyou from "../../hooks/useThankyou";
import { contactSchema } from "../../services/contactSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const Container = styled(Box)`
  margin-top: 20px;
`;

const fullName = "fullName";
const dob = "dob";
const phoneNumber = "phoneNumber";
const zalo = "zalo";
const email = "email";
const address = "address";
const dream = "dream";

const FinalForm = () => {
  const [validate, setValidate] = useState<any>({});
  const { feedbackResults } = useFeedback();
  const { navigateThankyou } = useThankyou();

  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: {},
  } = useForm<ContactValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      fullName: undefined,
      dob: undefined,
      phoneNumber: undefined,
      zalo: undefined,
      email: undefined,
      address: undefined,
      dream: undefined,
    },
  });

  const _resetValidation = React.useCallback(
    (key: string) => {
      const _validate = { ...validate, [key]: null };
      setValidate(_validate);
    },
    [validate, setValidate]
  );

  const _validationHandler = React.useCallback(
    (e: any) => {
      setValidate(e);
    },
    [setValidate]
  );

  const onSubmit = React.useCallback(
    async (data: ContactValues) => {
      const fb = feedbackResults.toString().substring(1);
      try {
        setLoading(true);
        await sendResultToUser({
          receiver: data.email,
          email: "ken@techfox.io",
          subject: "KẾT QUẢ TRẮC NGHIỆM TÍNH CÁCH",
          name: "Mạnh Hùng",
          message: `TỔNG KẾT CỦA BẠN: ${fb}`,
        });

        await writeDataToSheet({
          fullName: data.fullName,
          dob: data.dob,
          phoneNumber: data.phoneNumber,
          zalo: data.zalo,
          email: data.email,
          address: data.address,
          dream: data.dream,
          personType: fb,
        });
      } catch (error) {
        console.log("SUBMIT ERR", error);
      } finally {
        setLoading(false);
        navigateThankyou(true);
      }
    },
    [feedbackResults]
  );

  const renderTitle = useCallback(() => {
    return (
      <Box>
        <Typography>
          Các bạn vui lòng điền thông tin và gửi đi. Hệ thống sẽ gửi lại kết quả
          tới email của các bạn. <br /> Xin chân thành cảm ơn!
        </Typography>
      </Box>
    );
  }, []);

  const renderForm = () => {
    return (
      <Box mt={3} display={"flex"} flexDirection={"column"} width={"100%"}>
        <FormInputGroup
          control={control}
          required
          type={fullName}
          errMessage={validate?.fullName?.message}
          resetValidate={() => _resetValidation(fullName)}
          name={fullName}
          id={fullName}
          placeText={"Họ và tên*"}
          placeholder={"Điền câu trả lời"}
        />
        <FormInputGroup
          control={control}
          required
          type={"date"}
          errMessage={validate?.dob?.message}
          resetValidate={() => _resetValidation(dob)}
          name={dob}
          id={dob}
          placeText={"Ngày, tháng, năm, sinh*"}
        />
        <FormInputGroup
          control={control}
          required
          type={phoneNumber}
          errMessage={validate?.phoneNumber?.message}
          resetValidate={() => _resetValidation(phoneNumber)}
          name={phoneNumber}
          id={phoneNumber}
          placeText={"Số điện thoại*"}
          placeholder={"Điền câu trả lời"}
        />
        <FormInputGroup
          control={control}
          required
          type={email}
          errMessage={validate?.email?.message}
          resetValidate={() => _resetValidation(email)}
          name={email}
          id={email}
          placeText={"Email*"}
          placeholder={"Điền câu trả lời"}
        />
        <FormInputGroup
          control={control}
          type={zalo}
          errMessage={validate?.zalo?.message}
          resetValidate={() => _resetValidation(zalo)}
          name={zalo}
          id={zalo}
          placeText={"Zalo"}
          placeholder={"Điền câu trả lời"}
        />
        <FormInputGroup
          control={control}
          required
          type={address}
          name={address}
          id={address}
          resetValidate={() => _resetValidation(address)}
          errMessage={validate?.address?.message}
          placeText={"Địa chỉ*"}
          placeholder={"Điền câu trả lời"}
        />

        <FormInputGroup
          control={control}
          type={dream}
          name={dream}
          id={dream}
          placeText={"Nguyện vọng Trường và Ngành ở Việt Nam?"}
          placeholder={"Điền câu trả lời"}
        />
        <Typography color={colors.alertRed}>
          Lưu ý: các ô đánh dấu * là bắt buộc phải điền
        </Typography>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit, _validationHandler)}
            >
              Nhận kết quả
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container>
      {renderTitle()}
      {renderForm()}
    </Container>
  );
};

export default FinalForm;
