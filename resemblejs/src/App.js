import React, { useEffect, useState } from "react";
import resemblejs from "resemblejs";

export default function App() {
  const [originData, setOriginData] = useState(null); // null | { file : File, src : string}
  const [compareData, setCompareData] = useState(null); // null | { file : File, src : string }
  const [resultData, setResultData] = useState(null); // null | { data : any, src : string}

  /**
   * 파일 업로드 함수
   * @param {Object} params - 파라미터 object
   * @param {Event} params.e - 이벤트
   * @param {React.Dispatch<React.SetStateAction<null | {file : File, src : string}>>} params.setState - setter함수
   * @author kyeongbeom
   */
  const uploadFile = ({ e, setState }) => {
    if (e.target.files[0] === undefined) {
      setState(null);
      return;
    }
    const fr = new FileReader();
    fr.onload = (result) => {
      setState({
        file: e.target.files[0],
        src: result.target.result,
      });
    };
    fr.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (originData !== null && compareData !== null) {
      resemblejs(originData.file)
        .outputSettings({
          errorColor: {
            red: 255,
            green: 0,
            blue: 255,
          },
        })
        .compareTo(compareData.file)
        .ignoreAntialiasing()
        .scaleToSameSize()
        .onComplete((data) => {
          console.log(data);
          setResultData({
            misMatchPercentage: data.misMatchPercentage,
            src: data.getImageDataUrl(),
          });
        });
    } else {
      setResultData(null);
    }
  }, [originData, compareData]);

  return (
    <div>
      <span>원본 </span>
      <input
        type="file"
        multiple
        onChange={(e) => uploadFile({ e, setState: setOriginData })}
        accept="image/*"
      />
      <span>수정본 </span>
      <input
        type="file"
        multiple
        onChange={(e) => uploadFile({ e, setState: setCompareData })}
        accept="image/*"
      />
      {resultData ? (
        <>
          <p>유사도 : {100 - resultData.misMatchPercentage}%</p>
          <img src={resultData.src} alt="결과이미지" />
        </>
      ) : (
        <p>⁙ 원본이미지와 수정이미지을 업로드하세요 ⁙</p>
      )}
    </div>
  );
}
