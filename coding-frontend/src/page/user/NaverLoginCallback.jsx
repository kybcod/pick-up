import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

const NaverLoginCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      // 서버에 `code`를 보내서 액세스 토큰과 사용자 정보를 요청
      axios
        .post("/api/oauth/login/callback", { code, state })
        .then((response) => {
          const { token, emailExists, userInfo } = response.data;

          if (emailExists) {
            // 이메일이 존재하면 토큰을 로컬 스토리지에 저장하고 로그인 상태 업데이트 후 홈으로 리다이렉트
            if (token) {
              localStorage.setItem("token", token);
              account.login(token);
              navigate("/");
            } else {
              // 토큰이 없는 경우 실패 처리
              navigate("/login");
            }
          } else {
            // 이메일이 존재하지 않으면 회원가입 페이지로 리다이렉트
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            navigate("/signup");
          }
        })
        .catch(() => {
          // 에러 발생 시 회원가입 페이지로 리다이렉트
          navigate("/signup");
        });
    } else {
      // code가 없을 경우 에러 처리 또는 로그인 페이지로 리다이렉트
      navigate("/signup");
    }
  }, [location, navigate, account]);

  return null;
};

export default NaverLoginCallback;
