import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { register, clearError } from "../../store/slices/authSlice";
import {
  Card,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Select,
} from "../../styles/Theme";
import styled from "styled-components";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: var(--spacing-xxl) auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("student");
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
    if (!username || !email || !password || !confirmPassword) {
      setFormError("נא למלא את כל השדות");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("הסיסמאות אינן תואמות");
      return;
    }

    if (password.length < 6) {
      setFormError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    // נקה את השגיאות הקודמות
    setFormError("");

    // הרשמה
    dispatch(register({ username, email, password, role }) as any);
  };

  if (isLoading) {
    return <Loading message="יוצר חשבון..." />;
  }

  return (
    <RegisterContainer>
      <Card>
        <Title>הרשמה</Title>

        {error && <ErrorMessage message={error} />}
        {formError && <ErrorMessage message={formError} />}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">שם משתמש</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="שם משתמש"
            />
          </FormGroup>

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
            <Label htmlFor="role">תפקיד</Label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">תלמיד</option>
              <option value="teacher">מורה</option>
            </Select>
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

          <FormGroup>
            <Label htmlFor="confirmPassword">אימות סיסמה</Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </FormGroup>

          <Button type="submit" style={{ width: "100%" }}>
            הרשם
          </Button>
        </Form>
      </Card>
    </RegisterContainer>
  );
};

export default RegisterPage;
