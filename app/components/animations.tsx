'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'

// ============================================
// Reusable Animation Variants
// ============================================

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
}

export const staggerContainer Fast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        }
    }
}

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    }
}

// ============================================
// Scroll Reveal Components
// ============================================

interface ScrollRevealProps {
    children: ReactNode
    className?: string
    variants?: Variants
    delay?: number
    once?: boolean
    amount?: number
}

export function ScrollReveal({
    children,
    className = '',
    variants = fadeInUp,
    delay = 0,
    once = true,
    amount = 0.2
}: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            transition={{ delay }}
            className={className}
            style={{ willChange: 'transform, opacity' }}
        >
            {children}
        </motion.div>
    )
}

interface StaggerContainerProps {
    children: ReactNode
    className?: string
    variants?: Variants
    once?: boolean
    amount?: number
}

export function StaggerContainer({
    children,
    className = '',
    variants = staggerContainer,
    once = true,
    amount = 0.15
}: StaggerContainerProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount })

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({
    children,
    className = ''
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <motion.div
            variants={staggerItem}
            className={className}
            style={{ willChange: 'transform, opacity' }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Hero Animation Components
// ============================================

export function HeroTextReveal({
    children,
    className = '',
    delay = 0
}: {
    children: ReactNode
    className?: string
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
                duration: 0.9,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={className}
            style={{ willChange: 'transform, opacity, filter' }}
        >
            {children}
        </motion.div>
    )
}

export function HeroImageReveal({
    children,
    className = '',
    delay = 0.3
}: {
    children: ReactNode
    className?: string
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
                duration: 1,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={className}
            style={{ willChange: 'transform, opacity' }}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Interactive Hover Components
// ============================================

export function PremiumCard({
    children,
    className = ''
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <motion.div
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
            }}
            whileTap={{ scale: 0.98 }}
            className={className}
            style={{ willChange: 'transform' }}
        >
            {children}
        </motion.div>
    )
}

export function FloatingElement({
    children,
    className = '',
    duration = 4
}: {
    children: ReactNode
    className?: string
    duration?: number
}) {
    return (
        <motion.div
            animate={{
                y: [0, -15, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function MagneticButton({
    children,
    className = ''
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// Counter Animation
// ============================================

export function AnimatedCounter({
    value,
    suffix = '',
    className = ''
}: {
    value: number
    suffix?: string
    className?: string
}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={className}
        >
            {isInView && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {value}{suffix}
                </motion.span>
            )}
        </motion.span>
    )
}

// ============================================
// Page Transition
// ============================================

export function PageTransition({
    children,
    className = ''
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
