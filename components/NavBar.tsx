"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import defaultLogo from "@/img/logo.png";
import darkLogo from "@/img/logo-white.png";

import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import {
  IconFridge,
  IconLamp,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
} from "@tabler/icons-react";
import CountertopsOutlinedIcon from "@mui/icons-material/CountertopsOutlined";
import { MdOutlineBathtub } from "react-icons/md";

import { BiCabinet } from "react-icons/bi";

import classes from "./HeaderMenu.module.css";
import { useRouter } from "next/navigation";

const mockdata = [
  {
    icon: BiCabinet,
    title: "Cabinets",
    description: "This Pokémon’s cry is very loud and distracting",
    link: "/client/cabinets",
  },
  {
    icon: IconFridge,
    title: "Appliances",
    description: "The fluid of Smeargle’s tail secretions changes",
    link: "/client/appliances",
  },
  {
    icon: IconLamp,
    title: "Lighting and Fans",
    description: "Yanma is capable of seeing 360 degrees without",
    link: "/client/lighting-fans",
  },
  {
    icon: MdOutlineBathtub,
    title: "Kitchen and Bath Plumbing",
    description: "The shell’s rounded shape and the grooves on its.",
    link: "/client/plumbing",
  },
  {
    icon: CountertopsOutlinedIcon,
    title: "Countertops and Tile",
    description: "This Pokémon uses its flying ability to quickly chase",
    link: "/client/countertops-tile",
  },
];

export default function NavBar() {
  const router = useRouter();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <UnstyledButton
      className={classes.subLink}
      key={item.title}
      onClick={() => router.push(item.link)}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={120}>
      <header className={`bg-background ${classes.header}`}>
        <Group justify="space-between" h="100%">
          <Link className="flex justify-start" href="/">
            <img
              src={defaultLogo.src}
              alt="Company Logo"
              width={200}
              height={150}
              className="lightLogo"
            />
            <img
              src={darkLogo.src}
              alt="Company Logo"
              width={200}
              height={150}
              className="darkLogo"
            />
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/" className={classes.link}>
              Home
            </a>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Services
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="/client/faq" className={classes.link}>
              FAQ
            </a>
            <a href="/client/contact" className={classes.link}>
              Contact
            </a>
            <a href="/admin" className={classes.link}>
              Dashboard
            </a>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="75%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="xs" />

          <a href="/" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Services
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="/client/faq" className={classes.link}>
            FAQ
          </a>
          <a href="/client/contact" className={classes.link}>
            Contact
          </a>
          <a href="/admin" className={classes.link}>
            Dashboard
          </a>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
