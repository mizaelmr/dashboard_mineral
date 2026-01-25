import { Typography } from "antd";
import styled from "styled-components";

export const ContainerA4 = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;  

export const A4SheetContainer = styled.div`
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    boxSizing: border-box;
`;

export const BoxButtons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

export const BoxButtonsActions = styled.div`
    display: flex;
    gap: 10px;  
`;

export const BoxInfoCooperativa = styled.div`
    display: flex;
    flex-direction: column;
`;

export const BoxQrcodeImg = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const CertificateQrcode = styled(Typography)`
    font-size: 11px;
    font-weight: 600;
    font-family: Roboto, sans-serif;
    color: #797979;
    text-align: center;
    flex-shrink: 0;
`;

export const TextQrCode = styled(Typography)`
    font-size: 12px;
    text-align: center;
    color: #797979;
    font-weight: 600;
`;

export const DataQrCode = styled(Typography)`
    font-size: 10px;
    color: #797979;
    text-align: center;
`;

export const TextQrCodeBold = styled(Typography)`
    font-size: 12px;
    text-align: center;
    color: #8e000b;
    font-weight: 600;
`;

export const NameCooperativa = styled(Typography)`
    font-size: 14px;
    font-weight: 700;
    font-family: Roboto, sans-serif;
    color: #797979;
`;

export const BoxValueCooperativa = styled.div`
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 2px;
`;

export const LabelCooperativa = styled(Typography)`
    font-size: 11px;
    font-weight: 600;
    font-family: Roboto, sans-serif;
    color: #797979;
    flex-shrink: 0;
`;

export const ValueCooperativa = styled.span`
    display: block;
    font-size: 12px;
    font-family: Roboto, sans-serif;
    color: #7a7a7a;
    flex: 1;
    min-width: 0;
    overflow-wrap: break-word;
    word-wrap: break-word;
`;

export const BoxData = styled.div`
    margin-bottom: 8px;
`;

export const BoxLabel = styled.div`
    background-color: #f5f5f5;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 600;
    font-family: Roboto, sans-serif;
    color: #797979;
    border-radius: 6px;
`;

export const BoxValue = styled.div`
    background-color: #ffffff;
    padding: 8px 10px;
    font-size: 11px;
    display: flex;
    align-items: center;
    color: #7a7a7a;
`;

export const LabelAdditionalInfo = styled.div`
    text-align: center;
    font-size: 12px;
    background-color: #f5f5f5;
    font-family: Roboto, sans-serif;
    color: #797979;
    margin-bottom: 12px;
    padding: 6px 10px;
    border-radius: 6px;
`;

export const BoxSignature = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #000;
    padding-top: 6px;
`;

export const Signature = styled(Typography)`
    font-size: 14px;
    text-align: center;
    margin-bottom: 3px;
    color: #6b6b6b;
`;

export const BoxLegalInfoText = styled.div`
    font-size: 11px;
    color: #797979;
`;

export const BoxLegalInfo = styled.div`
    color: #797979;
    margin-top: 30px;
`;

export const LegalInfo = styled.strong`
    font-size: 11px;
    color: #7a7a7a;
`;

export const DateAndTime = styled.div`
    font-size: 11px;
    color: #797979;
    text-align: center;
`;

export const A4Sheet = styled.div`
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    padding: 30px;
    background-color: #ffffff;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
`;
