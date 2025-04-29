import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { login, clearError } from "../../store/slices/authSlice";
import {
  Card,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorMessage as StyledErrorMessage,
} from "../../styles/Theme";
import styled from "styled-components";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const LoginContainer = styled.div`
  max-width: 500px;
  margin: var(--spacing-xxl) auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // נקה את השגיאות הקודמות
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // אם המשתמש מחובר, נפנה אותו לדף הראשי המתאים לתפקידו
    if (isAuthenticated && user) {
      if (user.role === "teacher") {
        navigate("/teacher");
      } else if (user.role === "student") {
        navigate("/student");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // בדיקת תקינות בסיסית
    if (!email || !password) {
      setFormError("נא למלא את כל השדות");
      return;
    }

    // נקה את השגיאות הקודמות
    setFormError("");

    // התחברות
    dispatch(login({ email, password }) as any);
  };

  if (isLoading) {
    return <Loading message="מתחבר..." />;
  }

  return (
    <LoginContainer>
      <Card>
        <Title>התחברות</Title>

        {error && <ErrorMessage message={error} />}
        {formError && <ErrorMessage message={formError} />}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">אימייל</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">סיסמה</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </FormGroup>

          <Button type="submit" style={{ width: "100%" }}>
            התחבר
          </Button>
        </Form>
      </Card>
    </LoginContainer>
  );
};

export default LoginPage;
