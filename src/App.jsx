import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, MapPin, PenTool, Instagram, Youtube, MessageCircle, 
  Calculator, CheckCircle2, Percent, Download, ChevronDown, ChevronUp, Printer
} from 'lucide-react';

// --- 마케팅 채널별 상세 서비스 단가표 데이터 ---
const MARKETING_DATA = {
  naver: {
    id: 'naver',
    name: '네이버 플레이스',
    icon: MapPin,
    color: 'text-blue-500',
    setup: [
      { id: 'n_s_0', name: '선택 안함', price: 0, desc: '기존 세팅 유지' },
      { id: 'n_s_1', name: '기본 세팅', price: 150000, desc: '플레이스 등록, 기본 정보 및 이미지 최적화' },
      { id: 'n_s_2', name: '프리미엄 세팅', price: 300000, desc: 'SEO 최적화, 기획형 영수증 리뷰 10건, 스마트콜 세팅' }
    ],
    monthly: [
      { id: 'n_m_0', name: '선택 안함', price: 0, desc: '유지보수 없음' },
      { id: 'n_m_1', name: '기본 관리', price: 200000, desc: '주간 트래픽 관리, 순위 모니터링 및 리포트' },
      { id: 'n_m_2', name: '집중 관리', price: 500000, desc: '리뷰 지속 관리, 블로그 체험단 월 5팀 연계' }
    ]
  },
  blog: {
    id: 'blog',
    name: '브랜드 블로그',
    icon: PenTool,
    color: 'text-green-500',
    setup: [
      { id: 'b_s_0', name: '선택 안함', price: 0, desc: '기존 블로그 활용' },
      { id: 'b_s_1', name: '기본 스킨 디자인', price: 200000, desc: 'PC/모바일 커버 이미지 및 프로필 세팅' },
      { id: 'b_s_2', name: '홈페이지형 스킨', price: 400000, desc: '고급 홈페이지형 위젯 스킨, 카테고리 기획' }
    ],
    monthly: [
      { id: 'b_m_0', name: '선택 안함', price: 0, desc: '포스팅 대행 없음' },
      { id: 'b_m_1', name: '주 1회 포스팅 (월 4건)', price: 300000, desc: '정보성/홍보성 원고 기획 및 이미지 제작' },
      { id: 'b_m_2', name: '주 2회 포스팅 (월 8건)', price: 600000, desc: '전문 원고 작성 및 지역 키워드 상위노출 관리' }
    ]
  },
  insta: {
    id: 'insta',
    name: '인스타그램',
    icon: Instagram,
    color: 'text-pink-500',
    setup: [
      { id: 'i_s_0', name: '선택 안함', price: 0, desc: '기존 계정 활용' },
      { id: 'i_s_1', name: '계정 및 피드 기획', price: 200000, desc: '프로필 최적화, 하이라이트 디자인, 톤앤매너 기획' },
    ],
    monthly: [
      { id: 'i_m_0', name: '선택 안함', price: 0, desc: '콘텐츠 제작 없음' },
      { id: 'i_m_1', name: '베이직 (월 4건)', price: 400000, desc: '카드뉴스 피드 3건 + 릴스 1건 제작' },
      { id: 'i_m_2', name: '스탠다드 (월 8건)', price: 800000, desc: '카드뉴스 피드 4건 + 릴스 4건 + 스폰서드 광고 세팅' }
    ]
  },
  youtube: {
    id: 'youtube',
    name: '유튜브 채널',
    icon: Youtube,
    color: 'text-red-500',
    setup: [
      { id: 'y_s_0', name: '선택 안함', price: 0, desc: '기존 채널 활용' },
      { id: 'y_s_1', name: '채널 개설 및 브랜딩', price: 300000, desc: '채널아트, 프로필, 워터마크, 기본 설명 SEO 세팅' },
    ],
    monthly: [
      { id: 'y_m_0', name: '선택 안함', price: 0, desc: '영상 제작 없음' },
      { id: 'y_m_1', name: '쇼츠 특화 (월 4건)', price: 600000, desc: '60초 이내 숏폼 영상 기획/편집 (촬영본 제공 시)' },
      { id: 'y_m_2', name: '롱폼+쇼츠 (월 2+2건)', price: 1200000, desc: '10분 내외 롱폼 2건 + 쇼츠 2건 기획/편집' }
    ]
  },
  threads: {
    id: 'threads',
    name: '쓰레드 (Threads)',
    icon: MessageCircle,
    color: 'text-black',
    setup: [
      { id: 't_s_0', name: '선택 안함', price: 0, desc: '기존 계정 활용' },
      { id: 't_s_1', name: '프로필 세팅', price: 150000, desc: '브랜드 페르소나 기획 및 초기 팔로워 구축 (100명)' },
    ],
    monthly: [
      { id: 't_m_0', name: '선택 안함', price: 0, desc: '운영 안함' },
      { id: 't_m_1', name: '데일리 소통 (주 3회)', price: 300000, desc: '텍스트 기반 트렌드 게시물 및 답글 소통' },
    ]
  },
  performance: {
    id: 'performance',
    name: '퍼포먼스 마케팅 (광고)',
    icon: Megaphone,
    color: 'text-purple-500',
    setup: [
      { id: 'p_s_0', name: '선택 안함', price: 0, desc: '추적 세팅 불필요' },
      { id: 'p_s_1', name: '추적 픽셀 & GA4 세팅', price: 300000, desc: '메타 픽셀, 카카오 픽셀, 구글 애널리틱스 전자상거래 세팅' },
    ],
    monthly: [
      { id: 'p_m_0', name: '선택 안함', price: 0, desc: '광고 집행 안함' },
      { id: 'p_m_1', name: '광고 운영 대행 (기본)', price: 300000, desc: '월 광고비 300만 원 미만 기준 운영 수수료' },
      { id: 'p_m_2', name: '광고 운영 대행 (프로)', price: 500000, desc: '월 광고비 300~500만 원 기준 운영 수수료 (A/B테스트 포함)' }
    ]
  }
};

export default function App() {
  const [selections, setSelections] = useState({
    naver: { setup: 'n_s_1', monthly: 'n_m_1' },
    blog: { setup: 'b_s_1', monthly: 'b_m_1' },
    insta: { setup: 'i_s_1', monthly: 'i_m_1' },
    youtube: { setup: 'y_s_1', monthly: 'y_m_0' },
    threads: { setup: 't_s_1', monthly: 't_m_0' },
    performance: { setup: 'p_s_0', monthly: 'p_m_0' }
  });

  // 할인율 분리 상태
  const [setupDiscountRate, setSetupDiscountRate] = useState(0);
  const [monthlyDiscountRate, setMonthlyDiscountRate] = useState(0);

  const [customPrices, setCustomPrices] = useState({});
  const [overrideTotal, setOverrideTotal] = useState(null);
  const [overrideFinalRounded, setOverrideFinalRounded] = useState(null); // 최종 절삭 금액 수동 수정 상태
  const [clientName, setClientName] = useState('');
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [stampImage, setStampImage] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // 옵션이나 할인율 변경 시 수동 총계 초기화
  useEffect(() => {
    setOverrideTotal(null);
    setOverrideFinalRounded(null);
  }, [selections, setupDiscountRate, monthlyDiscountRate, customPrices]);

  const formatPrice = (price) => Math.round(price).toLocaleString();

  const handleSelect = (categoryKey, type, optionId) => {
    setSelections(prev => ({
      ...prev,
      [categoryKey]: { ...prev[categoryKey], [type]: optionId }
    }));
    setCustomPrices(prev => {
      const next = { ...prev };
      delete next[`${categoryKey}_${type}`];
      return next;
    });
  };

  const handlePriceChange = (catKey, type, value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setCustomPrices(prev => ({
      ...prev,
      [`${catKey}_${type}`]: numericValue
    }));
  };

  const adjustPrice = (catKey, type, currentPrice, delta) => {
    const newPrice = Math.max(0, currentPrice + delta);
    setCustomPrices(prev => ({
      ...prev,
      [`${catKey}_${type}`]: newPrice
    }));
  };

  const { 
    totalSetupFee, 
    totalMonthlyFee, 
    setupDiscountAmt,
    monthlyDiscountAmt,
    discountedSetupFee, 
    discountedMonthlyFee,
    setupItemsList,
    monthlyItemsList
  } = useMemo(() => {
    let setupTotal = 0;
    let monthlyTotal = 0;
    const sList = [];
    const mList = [];

    Object.keys(selections).forEach(catKey => {
      const catData = MARKETING_DATA[catKey];
      const selectedSetup = catData.setup.find(o => o.id === selections[catKey].setup);
      const selectedMonthly = catData.monthly.find(o => o.id === selections[catKey].monthly);

      if (selectedSetup && selectedSetup.price > 0) {
        const override = customPrices[`${catKey}_setup`];
        const finalPrice = override !== undefined ? override : selectedSetup.price;
        setupTotal += finalPrice;
        sList.push({ catKey, type: 'setup', category: catData.name, name: selectedSetup.name, price: finalPrice });
      }
      if (selectedMonthly && selectedMonthly.price > 0) {
        const override = customPrices[`${catKey}_monthly`];
        const finalPrice = override !== undefined ? override : selectedMonthly.price;
        monthlyTotal += finalPrice;
        mList.push({ catKey, type: 'monthly', category: catData.name, name: selectedMonthly.name, price: finalPrice });
      }
    });

    const sDiscountAmt = setupTotal * (setupDiscountRate / 100);
    const mDiscountAmt = monthlyTotal * (monthlyDiscountRate / 100);

    return {
      totalSetupFee: setupTotal,
      totalMonthlyFee: monthlyTotal,
      setupDiscountAmt: sDiscountAmt,
      monthlyDiscountAmt: mDiscountAmt,
      discountedSetupFee: setupTotal - sDiscountAmt,
      discountedMonthlyFee: monthlyTotal - mDiscountAmt,
      setupItemsList: sList,
      monthlyItemsList: mList
    };
  }, [selections, setupDiscountRate, monthlyDiscountRate, customPrices]);

  const handlePrintPDF = async () => {
    setIsPrinting(true);
    try {
      if (!window.html2canvas) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      if (!window.jspdf) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      const element = document.querySelector('.print-area');
      window.scrollTo(0, 0);

      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clone = clonedDoc.querySelector('.print-area');
          clone.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
          clone.querySelectorAll('.print-only').forEach(el => {
            el.style.display = 'inline';
            el.style.visibility = 'visible';
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const fileNameDate = quoteDate.replace(/-/g, '');
      pdf.save(`견적서_${clientName || '오빠네'}_${fileNameDate}.pdf`);

    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 브라우저의 인쇄 기능을 이용해 주세요.');
    } finally {
      setIsPrinting(false);
    }
  };

  const formatKoreanDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  };

  const numberToKorean = (number) => {
    const koreanNumbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const tenUnits = ['', '십', '백', '천'];
    const tenThousandUnits = ['', '만', '억', '조'];
    let result = '';
    let numStr = Math.floor(number).toString();
    if (number === 0) return '영';
    for (let i = 0; i < numStr.length; i++) {
        let digit = parseInt(numStr[i]);
        let pos = numStr.length - i - 1;
        let tenUnit = pos % 4;
        let tenThousandUnit = Math.floor(pos / 4);
        if (digit !== 0) result += koreanNumbers[digit] + tenUnits[tenUnit];
        if (tenUnit === 0 && number % Math.pow(10, (tenThousandUnit+1)*4) >= Math.pow(10, tenThousandUnit*4)) {
            result += tenThousandUnits[tenThousandUnit];
        }
    }
    return result;
  };

  const baseSupplyTotal = discountedSetupFee + discountedMonthlyFee;
  const baseVat = baseSupplyTotal * 0.1;
  const baseFinalTotal = baseSupplyTotal + baseVat;

  const displayFinalTotal = overrideTotal !== null ? overrideTotal : baseFinalTotal;
  const displaySupplyTotal = overrideTotal !== null ? Math.round(displayFinalTotal / 1.1) : baseSupplyTotal;
  const displayVat = overrideTotal !== null ? displayFinalTotal - displaySupplyTotal : baseVat;
  
  // 최종 금액 만원 단위 절삭 계산 및 수동 수정 연동
  const calculatedRoundedAmount = Math.floor(displayFinalTotal / 10000) * 10000;
  const finalRoundedAmount = overrideFinalRounded !== null ? overrideFinalRounded : calculatedRoundedAmount;

  const handleTotalChange = (value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setOverrideTotal(numericValue);
    setOverrideFinalRounded(null); // 총계 수정 시 절삭 금액 초기화
  };

  const handleFinalRoundedChange = (value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setOverrideFinalRounded(numericValue);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setStampImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-only { display: inline !important; }
          .print-area { display: block !important; width: 100% !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; border: none !important; }
          @page { size: A4 portrait; margin: 0; }
        }
        .print-only { display: none; }
        .editable-price { width: 100%; text-align: right; background: transparent; border: 1px solid transparent; border-radius: 4px; padding: 2px 4px; outline: none; transition: all 0.2s; cursor: pointer; }
        .editable-price:hover { background: #eff6ff; border-color: #bfdbfe; }
        .editable-price:focus { background: #ffffff; border-color: #3b82f6; cursor: text; }
      `}} />

      <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-20">
        <nav className="bg-white shadow-sm sticky top-0 z-50 no-print">
          <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg"><Megaphone className="w-6 h-6 text-white" /></div>
              <span className="font-bold text-2xl text-gray-900 tracking-tight">MARKET<span className="text-blue-600">PRO</span></span>
            </div>
          </div>
        </nav>

        <header className="bg-white border-b border-gray-200 no-print py-12 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">맞춤형 마케팅 견적서 자동 생성기</h1>
          <p className="text-gray-600">섹션별 할인율을 다르게 적용하여 정교한 견적서를 생성해 보세요.</p>
        </header>

        <section id="calculator" className="py-10">
          <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              
              {/* 좌측 패널 (옵션 선택 및 독립적 할인율 조절) */}
              <div className="w-full xl:w-[45%] flex flex-col gap-8 no-print">
                
                {/* 1. 초기 세팅 섹션 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="text-xl font-bold text-gray-900">초기 세팅 및 기획 <span className="text-sm font-normal text-gray-500 ml-2">(1회성)</span></h3>
                  </div>

                  {/* 초기 세팅 전용 할인 슬라이더 */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-blue-900 flex items-center gap-2 text-sm"><Percent className="w-4 h-4" /> 초기 세팅 프로모션 할인</label>
                      <span className="text-lg font-extrabold text-blue-600">{setupDiscountRate}%</span>
                    </div>
                    <input type="range" min="0" max="50" step="5" value={setupDiscountRate} onChange={(e) => setSetupDiscountRate(Number(e.target.value))} className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>

                  <div className="flex flex-col gap-3">
                    {Object.values(MARKETING_DATA).map((category) => (
                      <div key={`setup-${category.id}`} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                          <h4 className="font-bold text-gray-800 text-sm">{category.name}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {category.setup.map((opt) => (
                            <div key={opt.id} onClick={() => handleSelect(category.id, 'setup', opt.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${selections[category.id].setup === opt.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                              <div className="font-bold text-gray-900 text-xs mb-1">{opt.name}</div>
                              <div className="text-blue-600 font-semibold text-xs mb-1">{formatPrice(opt.price)}원</div>
                              <p className="text-[11px] text-gray-500 leading-tight">{opt.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 월 관리 섹션 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <h3 className="text-xl font-bold text-gray-900">월 관리 및 운영 <span className="text-sm font-normal text-gray-500 ml-2">(매월 청구)</span></h3>
                  </div>

                  {/* 월 관리 전용 할인 슬라이더 */}
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-bold text-green-900 flex items-center gap-2 text-sm"><Percent className="w-4 h-4" /> 월 관리 프로모션 할인</label>
                      <span className="text-lg font-extrabold text-green-600">{monthlyDiscountRate}%</span>
                    </div>
                    <input type="range" min="0" max="50" step="5" value={monthlyDiscountRate} onChange={(e) => setMonthlyDiscountRate(Number(e.target.value))} className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                  </div>

                  <div className="flex flex-col gap-3">
                    {Object.values(MARKETING_DATA).map((category) => (
                      <div key={`monthly-${category.id}`} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <category.icon className={`w-5 h-5 ${category.color}`} />
                          <h4 className="font-bold text-gray-800 text-sm">{category.name}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {category.monthly.map((opt) => (
                            <div key={opt.id} onClick={() => handleSelect(category.id, 'monthly', opt.id)} className={`p-3 rounded-lg border cursor-pointer transition-all ${selections[category.id].monthly === opt.id ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 bg-white hover:border-green-300'}`}>
                              <div className="font-bold text-gray-900 text-xs mb-1">{opt.name}</div>
                              <div className="text-green-600 font-semibold text-xs mb-1">{opt.price === 0 ? '0원' : `${formatPrice(opt.price)}원`}</div>
                              <p className="text-[11px] text-gray-500 leading-tight">{opt.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측 패널 (표준 견적서 프리뷰) */}
              <div className="w-full xl:w-[55%] xl:sticky xl:top-24 flex flex-col items-center">
                <div className="w-full max-w-[800px] flex justify-between items-end mb-4 no-print">
                  <div>
                    <div className="text-gray-500 text-sm font-medium mb-1">실시간 견적서 미리보기</div>
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1.5 rounded border border-blue-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 상단과 하단의 최종 금액은 만원 단위로 연동 및 수정이 가능합니다.
                    </div>
                  </div>
                  <button onClick={handlePrintPDF} disabled={isPrinting} className={`px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg h-fit transition-all ${isPrinting ? 'bg-gray-400 cursor-wait' : 'bg-gray-800 text-white hover:bg-blue-600 active:scale-95'}`}>
                    <Printer className="w-4 h-4" /> {isPrinting ? 'PDF 생성 중...' : 'PDF 저장 및 인쇄'}
                  </button>
                </div>

                {/* 📄 실제 종이 견적서 UI 컨테이너 */}
                <div className="print-area w-full max-w-[800px] bg-white shadow-2xl border border-gray-300 p-12 font-sans text-black relative">
                  <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold tracking-[1em] ml-[0.5em] border-b-2 border-black inline-block pb-3">견 적 서</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-6">
                    <div className="w-full sm:w-1/2">
                      <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                        견적일자 : 
                        <input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} className="no-print border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-transparent cursor-pointer" />
                        <span className="print-only">{formatKoreanDate(quoteDate)}</span>
                      </div>
                      <div className="text-xl font-bold border-b border-black pb-1 inline-flex items-end gap-1 pr-10">
                        <input type="text" placeholder="수신자 입력" value={clientName} onChange={(e) => setClientName(e.target.value)} className="no-print border-none focus:ring-0 outline-none w-40 bg-transparent text-xl font-bold p-1 placeholder-gray-300" />
                        <span className="print-only">{clientName || 'ㅇㅇ'}</span>
                        <span className="mb-1">귀하</span>
                      </div>
                      <div className="text-sm mt-3">아래와 같이 견적합니다.</div>
                    </div>

                    <div className="w-full sm:w-[45%] text-xs">
                      <table className="w-full border-collapse border border-black text-center relative">
                        <tbody>
                          <tr>
                            <th rowSpan="4" className="border border-black bg-gray-100 w-8 py-2 px-1 text-center font-bold" style={{writingMode: 'vertical-rl', textOrientation: 'upright'}}>공급자</th>
                            <td className="border border-black bg-gray-50 py-1.5 w-20 font-bold">등록번호</td>
                            <td colSpan="3" className="border border-black py-1.5 font-bold tracking-widest text-sm">123-45-67890</td>
                          </tr>
                          <tr>
                            <td className="border border-black bg-gray-50 py-1.5 font-bold">상 호</td>
                            <td className="border border-black py-1.5 text-left pl-2 font-bold">오빠네</td>
                            <td className="border border-black bg-gray-50 py-1.5 w-12 font-bold">성명</td>
                            <td className="border border-black py-1.5 relative w-16">
                              최광운
                              <label className="absolute top-1/2 right-1 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer group">
                                {stampImage ? (
                                  <img src={stampImage} alt="도장" className="max-w-[150%] max-h-[150%] object-contain scale-125" style={{ mixBlendMode: 'multiply' }} />
                                ) : (
                                  <span className="w-full h-full rounded-full border border-red-500 text-red-500 text-[10px] flex items-center justify-center opacity-80 group-hover:bg-red-50 transition-colors">(인)</span>
                                )}
                                <input type="file" accept="image/*" className="hidden no-print" onChange={handleImageUpload} />
                              </label>
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black bg-gray-50 py-1.5 font-bold">사업장</td>
                            <td colSpan="3" className="border border-black py-1.5 text-left pl-2">천안시 동남구 옛시청길 2-1</td>
                          </tr>
                          <tr>
                            <td className="border border-black bg-gray-50 py-1.5 font-bold">업 태</td>
                            <td className="border border-black py-1.5 text-left pl-2">컨설팅</td>
                            <td className="border border-black bg-gray-50 py-1.5 font-bold">종목</td>
                            <td className="border border-black py-1.5 text-left pl-2">마케팅</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 합계 금액 섹션 (만원 단위 절삭 값으로 연동 및 수동 수정 가능) */}
                  <table className="w-full border-collapse border-2 border-black mb-8 text-black shadow-sm">
                    <tbody>
                      <tr>
                        <th className="w-24 md:w-32 bg-gray-100 border-r border-black py-4 text-lg font-bold tracking-[0.3em] text-center">합계금액</th>
                        <td className="p-4 bg-white align-middle">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="font-bold text-lg md:text-xl text-gray-800 tracking-tight">
                              일금 <span className="text-black underline underline-offset-4 decoration-1 decoration-gray-400">{numberToKorean(finalRoundedAmount)}</span> 원정
                            </div>
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-xl font-bold">₩</span>
                              <input 
                                type="text" 
                                value={formatPrice(finalRoundedAmount)} 
                                onChange={(e) => handleFinalRoundedChange(e.target.value)} 
                                className="no-print text-lg md:text-xl font-extrabold w-32 md:w-44 text-right bg-transparent border-b border-gray-200 outline-none pb-0.5" 
                                title="상하단 최종 금액이 연동됩니다. 직접 수정도 가능합니다."
                              />
                              <span className="print-only text-lg md:text-xl font-extrabold text-right">{formatPrice(finalRoundedAmount)}</span>
                              <span className="text-xs text-gray-500 ml-2">(VAT 포함)</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="w-full border-collapse border-y-2 border-black border-x border-gray-400 text-sm mb-12">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-400 py-2.5 w-12 text-center">No.</th>
                        <th className="border border-gray-400 py-2.5 w-1/4 text-center">품 명</th>
                        <th className="border border-gray-400 py-2.5 text-center">상 세 내 용</th>
                        <th className="border border-gray-400 py-2.5 w-12 text-center">수량</th>
                        <th className="border border-gray-400 py-2.5 w-24 text-center">단가</th>
                        <th className="border border-gray-400 py-2.5 w-28 text-center">공급가액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* [1] 초기 세팅 내역 */}
                      <tr><td colSpan="6" className="border border-gray-400 py-2 bg-gray-50 font-bold text-left pl-3 text-blue-800">[1] 초기 세팅 및 구성 비용 (1회성)</td></tr>
                      {setupItemsList.length > 0 ? setupItemsList.map((item, idx) => (
                        <tr key={`s-${idx}`}>
                          <td className="border border-gray-400 py-2 text-center text-gray-500">{idx + 1}</td>
                          <td className="border border-gray-400 py-2 text-center font-medium">{item.category}</td>
                          <td className="border border-gray-400 py-2 pl-3">{item.name}</td>
                          <td className="border border-gray-400 py-2 text-center">1</td>
                          <td className="border border-gray-400 py-2 pr-1">
                            <div className="flex items-center justify-end gap-1 no-print">
                              <button onClick={() => adjustPrice(item.catKey, item.type, item.price, -50000)} className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs">-</button>
                              <input type="text" value={formatPrice(item.price)} onChange={(e) => handlePriceChange(item.catKey, item.type, e.target.value)} className="editable-price no-print text-xs font-medium w-16 text-right" />
                              <button onClick={() => adjustPrice(item.catKey, item.type, item.price, 50000)} className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs">+</button>
                            </div>
                            <span className="print-only float-right pr-1">{formatPrice(item.price)}</span>
                          </td>
                          <td className="border border-gray-400 py-2 text-right pr-2">{formatPrice(item.price)}</td>
                        </tr>
                      )) : <tr><td colSpan="6" className="border border-gray-400 py-4 text-center text-gray-400">선택 내역 없음</td></tr>}
                      <tr className="bg-blue-50/20 font-bold"><td colSpan="5" className="border border-gray-400 py-2 text-center">초기 세팅 소계</td><td className="border border-gray-400 py-2 text-right pr-2 text-blue-800">{formatPrice(totalSetupFee)}</td></tr>
                      {setupDiscountRate > 0 && <tr className="bg-blue-50 text-blue-700 font-bold"><td colSpan="5" className="border border-gray-400 py-2 text-center">초기 세팅 프로모션 할인 (-{setupDiscountRate}%)</td><td className="border border-gray-400 py-2 text-right pr-2">-{formatPrice(setupDiscountAmt)}</td></tr>}

                      {/* [2] 월 관리 내역 */}
                      <tr><td colSpan="6" className="border border-gray-400 py-2 bg-gray-50 font-bold text-left pl-3 text-green-800">[2] 월 관리 및 운영 비용 (매월)</td></tr>
                      {monthlyItemsList.length > 0 ? monthlyItemsList.map((item, idx) => (
                        <tr key={`m-${idx}`}>
                          <td className="border border-gray-400 py-2 text-center text-gray-500">{idx + 1}</td>
                          <td className="border border-gray-400 py-2 text-center font-medium">{item.category}</td>
                          <td className="border border-gray-400 py-2 pl-3">{item.name}</td>
                          <td className="border border-gray-400 py-2 text-center">1</td>
                          <td className="border border-gray-400 py-2 pr-1">
                            <div className="flex items-center justify-end gap-1 no-print">
                              <button onClick={() => adjustPrice(item.catKey, item.type, item.price, -50000)} className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs">-</button>
                              <input type="text" value={formatPrice(item.price)} onChange={(e) => handlePriceChange(item.catKey, item.type, e.target.value)} className="editable-price no-print text-xs font-medium w-16 text-right" />
                              <button onClick={() => adjustPrice(item.catKey, item.type, item.price, 50000)} className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs">+</button>
                            </div>
                            <span className="print-only float-right pr-1">{formatPrice(item.price)}</span>
                          </td>
                          <td className="border border-gray-400 py-2 text-right pr-2">{formatPrice(item.price)}</td>
                        </tr>
                      )) : <tr><td colSpan="6" className="border border-gray-400 py-4 text-center text-gray-400">선택 내역 없음</td></tr>}
                      <tr className="bg-green-50/20 font-bold"><td colSpan="5" className="border border-gray-400 py-2 text-center">월 관리 소계</td><td className="border border-gray-400 py-2 text-right pr-2 text-green-800">{formatPrice(totalMonthlyFee)}</td></tr>
                      {monthlyDiscountRate > 0 && <tr className="bg-green-50 text-green-700 font-bold"><td colSpan="5" className="border border-gray-400 py-2 text-center">월 관리 프로모션 할인 (-{monthlyDiscountRate}%)</td><td className="border border-gray-400 py-2 text-right pr-2">-{formatPrice(monthlyDiscountAmt)}</td></tr>}

                      {/* 총계 요약 */}
                      <tr className="bg-gray-50"><td colSpan="5" className="border border-gray-400 py-2 text-center font-bold">공급가액 합계</td><td className="border border-gray-400 py-2 text-right pr-2 font-bold">{formatPrice(displaySupplyTotal)}</td></tr>
                      <tr className="bg-gray-50"><td colSpan="5" className="border border-gray-400 py-2 text-center font-bold">부가가치세 (VAT 10%)</td><td className="border border-gray-400 py-2 text-right pr-2 font-bold">{formatPrice(displayVat)}</td></tr>
                      <tr className="bg-gray-100 text-base font-extrabold">
                        <td colSpan="5" className="border border-gray-400 py-3 text-center tracking-tight">총 합계금액 (VAT 포함)</td>
                        <td className="border border-gray-400 py-2 pr-1 text-right">
                          <input type="text" value={formatPrice(displayFinalTotal)} onChange={(e) => handleTotalChange(e.target.value)} className="no-print editable-price text-right font-extrabold bg-transparent w-full outline-none text-sm md:text-base" />
                          <span className="print-only pr-1">{formatPrice(displayFinalTotal)}</span>
                        </td>
                      </tr>
                      {/* 최종 금액 만원 단위 절삭 - 폰트 크기 및 정렬 최적화 */}
                      <tr className="bg-yellow-50 text-base font-extrabold text-blue-900 border-2 border-yellow-200">
                        <td colSpan="5" className="border border-gray-400 py-3 text-center uppercase tracking-tight text-sm md:text-base">최종 결제 금액 (만원 단위 절삭)</td>
                        <td className="border border-gray-400 py-2 pr-1 text-right font-black">
                          <input 
                            type="text" 
                            value={formatPrice(finalRoundedAmount)} 
                            onChange={(e) => handleFinalRoundedChange(e.target.value)} 
                            className="no-print editable-price text-right font-black bg-transparent w-full outline-none text-base md:text-lg text-blue-900" 
                          />
                          <span className="print-only pr-1 text-base md:text-lg">{formatPrice(finalRoundedAmount)}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border border-gray-300 p-4 text-xs text-gray-700 leading-relaxed bg-gray-50">
                    <p className="font-bold mb-1">[견적 및 계약 안내사항]</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>본 견적서의 유효기간은 발행일로부터 14일입니다.</li>
                      <li>모든 금액은 부가가치세(VAT) 10%가 포함된 금액입니다.</li>
                      <li>월 관리 서비스는 매월 선청구 되며 최소 3개월 유지 조건입니다.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}
