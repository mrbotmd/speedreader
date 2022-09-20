import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  text: yup.string("Введите ваш текст").required("Текст не может быть пустым"),
});

export function NextToReadText({ startReading }) {
  const formik = useFormik({
    initialValues: {
      text: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      startReading(values.text);
    },
  });
  return (
    <Box
      sx={{
        width: "60%",
        height: "40%",
        p: 2,
        border: "1px solid blue",
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          fullWidth
          multiline
          autoFocus
          minRows="12"
          maxRows="12"
          id="text"
          name="text"
          label="Текст для быстрого чтения"
          placeholder="Введите текст для быстрого чтения"
          value={formik.values.text}
          onChange={formik.handleChange}
          error={formik.touched.text && Boolean(formik.errors.text)}
          helperText={formik.touched.text && formik.errors.text}
          required
        />
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          sx={{
            mt: 1,
            alignSelf: "end",
          }}
        >
          Читать
        </Button>
      </Box>
    </Box>
  );
}
