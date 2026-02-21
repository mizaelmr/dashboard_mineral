import { Typography } from "antd";
import styled from "styled-components";

export const ContainerA4 = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
`;  

export const A4SheetContainer = styled.div`
    width: 210mm;
    min-height: 297mm;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: visible;
    @media print {
        width: 100%;
        min-height: auto;
        overflow: visible;
        border-radius: 0;
    }
`;

export const BoxButtons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 210mm;
    max-width: calc(100% - 32px);
    margin: 0 auto;
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

export const CertificateBlock = styled.div`
    border: 1px solid #d9d9d9;
    padding: 10px 12px;
    font-size: 12px;
    color: #262626;
    line-height: 1.4;
`;

export const CertificateTitle = styled.div`
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    color: #262626;
    margin-bottom: 2px;
`;

export const CertificateSubtitle = styled.div`
    font-size: 12px;
    text-align: center;
    color: #595959;
    margin-bottom: 8px;
`;

export const CertificateLabel = styled.div`
    font-size: 11px;
    font-weight: 600;
    color: #595959;
    margin-top: 6px;
    margin-bottom: 2px;
`;

export const CertificateValue = styled.div`
    font-size: 12px;
    color: #262626;
`;

export const TextQrCode = styled(Typography)`
    font-size: 13px;
    text-align: center;
    color: #262626;
    font-weight: 600;
`;

export const TextQrCodeBold = styled(Typography)`
    font-size: 12px;
    text-align: center;
    color: #8e000b;
    font-weight: 700;
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
    gap: 4px;
    margin-bottom: 1px;
`;

export const LabelCooperativa = styled(Typography)`
    font-size: 12px;
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
    margin-bottom: 4px;
`;

export const BoxLabel = styled.div`
    background-color: #f5f5f5;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 600;
    font-family: Roboto, sans-serif;
    color: #797979;
    border-radius: 4px;
`;

export const BoxValue = styled.div`
    background-color: #ffffff;
    padding: 5px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    color: #7a7a7a;
`;

export const LabelAdditionalInfo = styled.div`
    text-align: center;
    font-size: 13px;
    background-color: #f5f5f5;
    font-family: Roboto, sans-serif;
    color: #797979;
    margin-bottom: 6px;
    padding: 5px 10px;
    border-radius: 4px;
`;

export const BoxSignature = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #000;
    padding-top: 4px;
`;

export const Signature = styled(Typography)`
    font-size: 13px;
    text-align: center;
    margin-bottom: 2px;
    color: #6b6b6b;
`;

export const TaxRatesSection = styled.div`
    margin-top: 8px;
`;

export const TaxRatesTitle = styled.div`
    font-size: 12px;
    color: #595959;
    font-weight: 600;
    margin-bottom: 6px;
`;

export const TaxRatesTable = styled.div`
    display: inline-table;
    border: 1px solid #ececec;
    border-radius: 4px;
    border-collapse: separate;
    border-spacing: 0;
    max-width: 100%;
`;

export const TaxRatesRow = styled.div`
    display: table-row;
`;

export const TaxRatesCell = styled.div`
    display: table-cell;
    font-size: 11px;
    color: #595959;
    padding: 6px 8px;
    white-space: nowrap;
    border-bottom: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
    &:last-child {
        border-right: none;
    }
`;

export const TaxRatesHeaderCell = styled(TaxRatesCell)`
    font-weight: 600;
    background-color: #fafafa;
`;

export const BoxLegalInfoText = styled.div`
    font-size: 11px;
    color: #595959;
    margin: 0 6px 10px 6px;
    line-height: 1.4;
`;

export const BoxLegalInfo = styled.div`
    color: #595959;
    margin-top: auto;
    padding-top: 24px;
    padding-bottom: 16px;
`;

export const LegalInfo = styled.p`
    font-size: 11px;
    color: #595959;
    margin: 0 6px 10px 6px;
    line-height: 1.4;
    font-weight: 400;
`;

export const DateAndTime = styled.div`
    font-size: 11px;
    color: #8c8c8c;
    text-align: center;
    margin-top: 14px;
`;

export const A4SheetContent = styled.div`
    flex: 1;
`;

export const A4Sheet = styled.div`
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 18px 20px 20px;
    background-color: #ffffff;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    overflow: visible;
    position: relative;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    @media print {
        min-height: auto;
        height: auto;
        overflow: visible;
        border-radius: 0;
        padding: 12mm 15mm 15mm;
        box-shadow: none;
    }
`;
