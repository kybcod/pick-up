import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

const NaverLoginSuccess = ({ token }) => {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    if (token) {
      // 토큰을 context의 로그인 메서드를 통해 처리
      localStorage.setItem("token", token);
      account.login(token);
      navigate("/"); // 홈 화면으로 이동
    } else {
      navigate("/signup"); // 로그인 실패 시 회원가입 페이지로 리다이렉트
    }
  }, [token, account, navigate]);

  return null;
};

export default NaverLoginSuccess;
