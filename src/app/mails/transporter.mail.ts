import { mailConfig } from "@config";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport(mailConfig);

export const transporter = transport;
