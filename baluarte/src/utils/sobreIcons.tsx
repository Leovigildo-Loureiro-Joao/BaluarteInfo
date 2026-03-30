import type { IconType } from "react-icons";
import {
  FiAward,
  FiCalendar,
  FiClock,
  FiHeart,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUsers,
} from "react-icons/fi";
import {
  GiChurch,
  GiCrown,
  GiFamilyHouse,
  GiHeartBeats,
  GiPrayer,
  GiSecretBook,
} from "react-icons/gi";
import { LiaBibleSolid } from "react-icons/lia";

const ICONS: Record<string, IconType> = {
  FiAward,
  FiCalendar,
  FiClock,
  FiHeart,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUsers,
  GiBible: LiaBibleSolid,
  GiChurch,
  GiCrown,
  GiFamilyHouse,
  GiHeartBeats,
  GiPrayer,
  GiSecretBook,
};

export const resolveSobreIcon = (name?: string | null): IconType => {
  if (!name) return FiHeart;
  return ICONS[name] ?? FiHeart;
};

